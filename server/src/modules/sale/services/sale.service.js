/**
 * Sale Service
 * =============
 * Business logic for sale operations
 */
import mongoose from 'mongoose'
import Party from '../../../shared/models/party.model.js'
import Sale from '../../../shared/models/sale.model.js'
import Stock from '../../../shared/models/stock.model.js'
import ApiError from '../../../shared/utils/api-error.js'
import { aggregatePaginate } from '../../../shared/utils/pagination.js'

class SaleService {
    /**
     * Get all sales for a mill with pagination and filters
     */
    async findAll(millId, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'saleDate',
            sortOrder = 'desc',
            search,
            partyId,
            stockType,
            paymentStatus,
            startDate,
            endDate,
        } = options

        // Build aggregation pipeline
        const pipeline = [
            { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        ]

        // Apply filters
        if (partyId) {
            pipeline.push({
                $match: { partyId: new mongoose.Types.ObjectId(partyId) },
            })
        }

        if (stockType) {
            pipeline.push({ $match: { stockType } })
        }

        if (paymentStatus) {
            pipeline.push({ $match: { paymentStatus } })
        }

        if (startDate || endDate) {
            const dateFilter = {}
            if (startDate) dateFilter.$gte = new Date(startDate)
            if (endDate) dateFilter.$lte = new Date(endDate)
            pipeline.push({ $match: { saleDate: dateFilter } })
        }

        // Lookup party details
        pipeline.push({
            $lookup: {
                from: 'parties',
                localField: 'partyId',
                foreignField: '_id',
                as: 'party',
                pipeline: [{ $project: { name: 1, phone: 1 } }],
            },
        })

        // Lookup broker details
        pipeline.push({
            $lookup: {
                from: 'brokers',
                localField: 'brokerId',
                foreignField: '_id',
                as: 'broker',
                pipeline: [{ $project: { name: 1, commissionRate: 1 } }],
            },
        })

        // Unwind lookups
        pipeline.push({
            $addFields: {
                party: { $arrayElemAt: ['$party', 0] },
                broker: { $arrayElemAt: ['$broker', 0] },
            },
        })

        // Search in invoice number
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { invoiceNumber: { $regex: search, $options: 'i' } },
                        { 'party.name': { $regex: search, $options: 'i' } },
                    ],
                },
            })
        }

        // Sort
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
        pipeline.push({ $sort: sort })

        // Use aggregate pagination
        const result = await aggregatePaginate(Sale, pipeline, { page, limit })

        return result
    }

    /**
     * Get sale by ID
     */
    async findById(millId, saleId) {
        const sale = await Sale.findOne({
            _id: saleId,
            millId,
        })
            .populate('partyId', 'name phone address')
            .populate('brokerId', 'name commissionRate')
            .populate('transporterId', 'name vehicleNumber')
            .populate('createdBy', 'name email')
            .lean()

        if (!sale) {
            throw ApiError.notFound('Sale not found')
        }

        return sale
    }

    /**
     * Create a new sale
     */
    async create(millId, data, createdBy) {
        // Generate invoice number if not provided
        if (!data.invoiceNumber) {
            const count = await Sale.countDocuments({ millId })
            const date = new Date()
            const year = date.getFullYear().toString().slice(-2)
            const month = String(date.getMonth() + 1).padStart(2, '0')
            data.invoiceNumber = `SAL-${year}${month}-${String(count + 1).padStart(4, '0')}`
        }

        // Check if invoice number already exists
        const existingSale = await Sale.findOne({
            millId,
            invoiceNumber: data.invoiceNumber,
        })

        if (existingSale) {
            throw ApiError.conflict('Invoice number already exists')
        }

        // Check stock availability
        const stock = await Stock.findOne({
            millId,
            stockType: data.stockType,
            variety: data.variety,
        })

        if (!stock || stock.currentStock < data.quantity) {
            throw ApiError.badRequest(
                `Insufficient stock. Available: ${stock?.currentStock || 0} ${data.unit || 'QUINTAL'}`
            )
        }

        // Create sale
        const sale = await Sale.create({
            ...data,
            millId,
            createdBy,
        })

        // Update stock (decrease)
        await this.updateStock(
            millId,
            data.stockType,
            data.variety,
            data.quantity,
            'subtract'
        )

        // Update party balance (they owe us money)
        if (sale.pendingAmount > 0 && data.partyId) {
            await Party.findByIdAndUpdate(data.partyId, {
                $inc: { currentBalance: -sale.pendingAmount }, // Negative because they owe us
            })
        }

        return sale
    }

    /**
     * Update sale
     */
    async update(millId, saleId, data) {
        const sale = await Sale.findOne({ _id: saleId, millId })

        if (!sale) {
            throw ApiError.notFound('Sale not found')
        }

        // Store old values for stock adjustment
        const oldQuantity = sale.quantity
        const oldStockType = sale.stockType
        const oldVariety = sale.variety
        const oldPendingAmount = sale.pendingAmount

        // If quantity is changing, check stock availability
        if (data.quantity !== undefined && data.quantity > oldQuantity) {
            const additionalQty = data.quantity - oldQuantity
            const stock = await Stock.findOne({
                millId,
                stockType: data.stockType || oldStockType,
                variety: data.variety || oldVariety,
            })

            if (!stock || stock.currentStock < additionalQty) {
                throw ApiError.badRequest(
                    `Insufficient stock for increase. Available: ${stock?.currentStock || 0}`
                )
            }
        }

        // Update sale fields
        Object.assign(sale, data)
        await sale.save()

        // Adjust stock if quantity/type changed
        if (
            data.quantity !== undefined ||
            data.stockType !== undefined ||
            data.variety !== undefined
        ) {
            // Reverse old stock deduction
            await this.updateStock(
                millId,
                oldStockType,
                oldVariety,
                oldQuantity,
                'add'
            )
            // Apply new stock deduction
            await this.updateStock(
                millId,
                sale.stockType,
                sale.variety,
                sale.quantity,
                'subtract'
            )
        }

        // Adjust party balance if pending amount changed
        if (sale.partyId && sale.pendingAmount !== oldPendingAmount) {
            const balanceDiff = oldPendingAmount - sale.pendingAmount // Note: reversed for sales
            await Party.findByIdAndUpdate(sale.partyId, {
                $inc: { currentBalance: balanceDiff },
            })
        }

        return sale
    }

    /**
     * Delete sale
     */
    async delete(millId, saleId) {
        const sale = await Sale.findOne({ _id: saleId, millId })

        if (!sale) {
            throw ApiError.notFound('Sale not found')
        }

        // Reverse stock (add back)
        await this.updateStock(
            millId,
            sale.stockType,
            sale.variety,
            sale.quantity,
            'add'
        )

        // Reverse party balance
        if (sale.partyId && sale.pendingAmount > 0) {
            await Party.findByIdAndUpdate(sale.partyId, {
                $inc: { currentBalance: sale.pendingAmount },
            })
        }

        await Sale.findByIdAndDelete(saleId)

        return { message: 'Sale deleted successfully' }
    }

    /**
     * Record payment for sale
     */
    async recordPayment(millId, saleId, paymentData) {
        const sale = await Sale.findOne({ _id: saleId, millId })

        if (!sale) {
            throw ApiError.notFound('Sale not found')
        }

        if (sale.pendingAmount <= 0) {
            throw ApiError.badRequest('No pending amount for this sale')
        }

        if (paymentData.amount > sale.pendingAmount) {
            throw ApiError.badRequest('Payment amount exceeds pending amount')
        }

        // Update sale
        sale.receivedAmount += paymentData.amount
        await sale.save()

        // Update party balance
        if (sale.partyId) {
            await Party.findByIdAndUpdate(sale.partyId, {
                $inc: { currentBalance: paymentData.amount },
            })
        }

        return sale
    }

    /**
     * Get sale summary/stats
     */
    async getSummary(millId, options = {}) {
        const { startDate, endDate, stockType } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (startDate || endDate) {
            matchStage.saleDate = {}
            if (startDate) matchStage.saleDate.$gte = new Date(startDate)
            if (endDate) matchStage.saleDate.$lte = new Date(endDate)
        }

        if (stockType) {
            matchStage.stockType = stockType
        }

        const summary = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$stockType',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalAmount: { $sum: '$totalAmount' },
                    totalGstAmount: { $sum: '$gstAmount' },
                    totalNetAmount: { $sum: '$netAmount' },
                    totalReceivedAmount: { $sum: '$receivedAmount' },
                    totalPendingAmount: { $sum: '$pendingAmount' },
                },
            },
            {
                $project: {
                    stockType: '$_id',
                    count: 1,
                    totalQuantity: 1,
                    totalAmount: { $round: ['$totalAmount', 2] },
                    totalGstAmount: { $round: ['$totalGstAmount', 2] },
                    totalNetAmount: { $round: ['$totalNetAmount', 2] },
                    totalReceivedAmount: {
                        $round: ['$totalReceivedAmount', 2],
                    },
                    totalPendingAmount: { $round: ['$totalPendingAmount', 2] },
                    _id: 0,
                },
            },
        ])

        // Calculate overall totals
        const overall = summary.reduce(
            (acc, item) => ({
                count: acc.count + item.count,
                totalQuantity: acc.totalQuantity + item.totalQuantity,
                totalAmount: acc.totalAmount + item.totalAmount,
                totalGstAmount: acc.totalGstAmount + item.totalGstAmount,
                totalNetAmount: acc.totalNetAmount + item.totalNetAmount,
                totalReceivedAmount:
                    acc.totalReceivedAmount + item.totalReceivedAmount,
                totalPendingAmount:
                    acc.totalPendingAmount + item.totalPendingAmount,
            }),
            {
                count: 0,
                totalQuantity: 0,
                totalAmount: 0,
                totalGstAmount: 0,
                totalNetAmount: 0,
                totalReceivedAmount: 0,
                totalPendingAmount: 0,
            }
        )

        return {
            byStockType: summary,
            overall,
        }
    }

    /**
     * Update stock
     */
    async updateStock(millId, stockType, variety, quantity, operation) {
        const stock = await Stock.findOne({ millId, stockType, variety })

        if (stock) {
            if (operation === 'add') {
                stock.currentStock += quantity
            } else {
                stock.currentStock = Math.max(0, stock.currentStock - quantity)
            }
            await stock.save()
        } else if (operation === 'add') {
            await Stock.create({
                millId,
                stockType,
                variety,
                currentStock: quantity,
            })
        }
    }
}

export default new SaleService()
