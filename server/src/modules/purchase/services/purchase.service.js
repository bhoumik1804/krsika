/**
 * Purchase Service
 * =================
 * Business logic for purchase operations
 */
import mongoose from 'mongoose'
import Party from '../../../shared/models/party.model.js'
import Purchase from '../../../shared/models/purchase.model.js'
import Stock from '../../../shared/models/stock.model.js'
import ApiError from '../../../shared/utils/api-error.js'
import {
    paginate,
    aggregatePaginate,
} from '../../../shared/utils/pagination.js'

class PurchaseService {
    /**
     * Get all purchases for a mill with pagination and filters
     */
    async findAll(millId, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'purchaseDate',
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
            pipeline.push({ $match: { purchaseDate: dateFilter } })
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
        const result = await aggregatePaginate(Purchase, pipeline, {
            page,
            limit,
        })

        return result
    }

    /**
     * Get purchase by ID
     */
    async findById(millId, purchaseId) {
        const purchase = await Purchase.findOne({
            _id: purchaseId,
            millId,
        })
            .populate('partyId', 'name phone address')
            .populate('brokerId', 'name commissionRate')
            .populate('transporterId', 'name vehicleNumber')
            .populate('createdBy', 'name email')
            .lean()

        if (!purchase) {
            throw ApiError.notFound('Purchase not found')
        }

        return purchase
    }

    /**
     * Create a new purchase
     */
    async create(millId, data, createdBy) {
        // Generate invoice number if not provided
        if (!data.invoiceNumber) {
            const count = await Purchase.countDocuments({ millId })
            const date = new Date()
            const year = date.getFullYear().toString().slice(-2)
            const month = String(date.getMonth() + 1).padStart(2, '0')
            data.invoiceNumber = `PUR-${year}${month}-${String(count + 1).padStart(4, '0')}`
        }

        // Check if invoice number already exists
        const existingPurchase = await Purchase.findOne({
            millId,
            invoiceNumber: data.invoiceNumber,
        })

        if (existingPurchase) {
            throw ApiError.conflict('Invoice number already exists')
        }

        // Create purchase
        const purchase = await Purchase.create({
            ...data,
            millId,
            createdBy,
        })

        // Update stock (increase)
        await this.updateStock(
            millId,
            data.stockType,
            data.variety,
            data.quantity,
            'add'
        )

        // Update party balance if payment is not complete
        if (purchase.pendingAmount > 0 && data.partyId) {
            await Party.findByIdAndUpdate(data.partyId, {
                $inc: { currentBalance: purchase.pendingAmount },
            })
        }

        return purchase
    }

    /**
     * Update purchase
     */
    async update(millId, purchaseId, data) {
        const purchase = await Purchase.findOne({ _id: purchaseId, millId })

        if (!purchase) {
            throw ApiError.notFound('Purchase not found')
        }

        // Store old values for stock adjustment
        const oldQuantity = purchase.quantity
        const oldStockType = purchase.stockType
        const oldVariety = purchase.variety
        const oldPendingAmount = purchase.pendingAmount

        // Update purchase fields
        Object.assign(purchase, data)
        await purchase.save()

        // Adjust stock if quantity/type changed
        if (
            data.quantity !== undefined ||
            data.stockType !== undefined ||
            data.variety !== undefined
        ) {
            // Reverse old stock
            await this.updateStock(
                millId,
                oldStockType,
                oldVariety,
                oldQuantity,
                'subtract'
            )
            // Add new stock
            await this.updateStock(
                millId,
                purchase.stockType,
                purchase.variety,
                purchase.quantity,
                'add'
            )
        }

        // Adjust party balance if pending amount changed
        if (purchase.partyId && purchase.pendingAmount !== oldPendingAmount) {
            const balanceDiff = purchase.pendingAmount - oldPendingAmount
            await Party.findByIdAndUpdate(purchase.partyId, {
                $inc: { currentBalance: balanceDiff },
            })
        }

        return purchase
    }

    /**
     * Delete purchase
     */
    async delete(millId, purchaseId) {
        const purchase = await Purchase.findOne({ _id: purchaseId, millId })

        if (!purchase) {
            throw ApiError.notFound('Purchase not found')
        }

        // Reverse stock
        await this.updateStock(
            millId,
            purchase.stockType,
            purchase.variety,
            purchase.quantity,
            'subtract'
        )

        // Reverse party balance
        if (purchase.partyId && purchase.pendingAmount > 0) {
            await Party.findByIdAndUpdate(purchase.partyId, {
                $inc: { currentBalance: -purchase.pendingAmount },
            })
        }

        await Purchase.findByIdAndDelete(purchaseId)

        return { message: 'Purchase deleted successfully' }
    }

    /**
     * Record payment for purchase
     */
    async recordPayment(millId, purchaseId, paymentData) {
        const purchase = await Purchase.findOne({ _id: purchaseId, millId })

        if (!purchase) {
            throw ApiError.notFound('Purchase not found')
        }

        if (purchase.pendingAmount <= 0) {
            throw ApiError.badRequest('No pending amount for this purchase')
        }

        if (paymentData.amount > purchase.pendingAmount) {
            throw ApiError.badRequest('Payment amount exceeds pending amount')
        }

        // Update purchase
        purchase.paidAmount += paymentData.amount
        await purchase.save()

        // Update party balance
        if (purchase.partyId) {
            await Party.findByIdAndUpdate(purchase.partyId, {
                $inc: { currentBalance: -paymentData.amount },
            })
        }

        return purchase
    }

    /**
     * Get purchase summary/stats
     */
    async getSummary(millId, options = {}) {
        const { startDate, endDate, stockType } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (startDate || endDate) {
            matchStage.purchaseDate = {}
            if (startDate) matchStage.purchaseDate.$gte = new Date(startDate)
            if (endDate) matchStage.purchaseDate.$lte = new Date(endDate)
        }

        if (stockType) {
            matchStage.stockType = stockType
        }

        const summary = await Purchase.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$stockType',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalAmount: { $sum: '$totalAmount' },
                    totalNetAmount: { $sum: '$netAmount' },
                    totalPaidAmount: { $sum: '$paidAmount' },
                    totalPendingAmount: { $sum: '$pendingAmount' },
                },
            },
            {
                $project: {
                    stockType: '$_id',
                    count: 1,
                    totalQuantity: 1,
                    totalAmount: { $round: ['$totalAmount', 2] },
                    totalNetAmount: { $round: ['$totalNetAmount', 2] },
                    totalPaidAmount: { $round: ['$totalPaidAmount', 2] },
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
                totalNetAmount: acc.totalNetAmount + item.totalNetAmount,
                totalPaidAmount: acc.totalPaidAmount + item.totalPaidAmount,
                totalPendingAmount:
                    acc.totalPendingAmount + item.totalPendingAmount,
            }),
            {
                count: 0,
                totalQuantity: 0,
                totalAmount: 0,
                totalNetAmount: 0,
                totalPaidAmount: 0,
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

export default new PurchaseService()
