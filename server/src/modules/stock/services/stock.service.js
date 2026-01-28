/**
 * Stock Service
 * =============
 * Business logic for stock management operations
 */
import mongoose from 'mongoose'
import { STOCK_TYPE } from '../../../shared/constants/stock-types.js'
import Stock from '../../../shared/models/stock.model.js'

const StockService = {
    /**
     * Find all stock records with filters and pagination
     */
    async findAll({
        millId,
        page = 1,
        limit = 10,
        stockType,
        sortBy = 'updatedAt',
        sortOrder = 'desc',
        lowStock = false,
    }) {
        const query = { mill: new mongoose.Types.ObjectId(millId) }

        if (stockType) {
            query.stockType = stockType
        }

        const aggregate = Stock.aggregate([
            { $match: query },
            {
                $addFields: {
                    isLowStock: {
                        $lte: ['$currentQuantity', '$lowStockThreshold'],
                    },
                },
            },
            ...(lowStock ? [{ $match: { isLowStock: true } }] : []),
            {
                $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
            },
        ])

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }

        return Stock.aggregatePaginate(aggregate, options)
    },

    /**
     * Find stock by ID
     */
    async findById(stockId, millId) {
        return Stock.findOne({
            _id: stockId,
            mill: millId,
        })
    },

    /**
     * Find stock by type for a mill
     */
    async findByType(stockType, millId) {
        return Stock.findOne({
            stockType,
            mill: millId,
        })
    },

    /**
     * Initialize stock record for a mill
     */
    async initializeStock({ millId, stockType, lowStockThreshold = 100 }) {
        // Check if stock record already exists
        const existing = await Stock.findOne({
            mill: millId,
            stockType,
        })

        if (existing) {
            return existing
        }

        const stock = new Stock({
            mill: millId,
            stockType,
            currentQuantity: 0,
            totalPurchased: 0,
            totalSold: 0,
            lowStockThreshold,
        })

        return stock.save()
    },

    /**
     * Initialize all stock types for a mill
     */
    async initializeAllStocks(millId) {
        const stockTypes = Object.values(STOCK_TYPE)
        const stocks = []

        for (const stockType of stockTypes) {
            const stock = await this.initializeStock({ millId, stockType })
            stocks.push(stock)
        }

        return stocks
    },

    /**
     * Update stock (internal method used by purchase/sale)
     */
    async updateStock({
        millId,
        stockType,
        quantityChange,
        isPurchase = true,
    }) {
        let stock = await Stock.findOne({
            mill: millId,
            stockType,
        })

        // Auto-initialize if not exists
        if (!stock) {
            stock = await this.initializeStock({ millId, stockType })
        }

        stock.currentQuantity += quantityChange

        if (isPurchase) {
            stock.totalPurchased += Math.abs(quantityChange)
        } else {
            stock.totalSold += Math.abs(quantityChange)
        }

        // Ensure quantity doesn't go negative
        if (stock.currentQuantity < 0) {
            stock.currentQuantity = 0
        }

        return stock.save()
    },

    /**
     * Add stock (from purchase)
     */
    async addStock({ millId, stockType, quantity }) {
        return this.updateStock({
            millId,
            stockType,
            quantityChange: quantity,
            isPurchase: true,
        })
    },

    /**
     * Deduct stock (from sale)
     */
    async deductStock({ millId, stockType, quantity }) {
        return this.updateStock({
            millId,
            stockType,
            quantityChange: -quantity,
            isPurchase: false,
        })
    },

    /**
     * Check stock availability
     */
    async checkAvailability(millId, stockType, requiredQuantity) {
        const stock = await Stock.findOne({
            mill: millId,
            stockType,
        })

        if (!stock) {
            return {
                available: false,
                currentQuantity: 0,
                requiredQuantity,
                shortfall: requiredQuantity,
            }
        }

        const isAvailable = stock.currentQuantity >= requiredQuantity

        return {
            available: isAvailable,
            currentQuantity: stock.currentQuantity,
            requiredQuantity,
            shortfall: isAvailable
                ? 0
                : requiredQuantity - stock.currentQuantity,
        }
    },

    /**
     * Update stock threshold
     */
    async updateThreshold(stockId, millId, lowStockThreshold) {
        return Stock.findOneAndUpdate(
            { _id: stockId, mill: millId },
            { lowStockThreshold },
            { new: true }
        )
    },

    /**
     * Get low stock alerts
     */
    async getLowStockAlerts(millId) {
        return Stock.aggregate([
            { $match: { mill: new mongoose.Types.ObjectId(millId) } },
            {
                $match: {
                    $expr: {
                        $lte: ['$currentQuantity', '$lowStockThreshold'],
                    },
                },
            },
            {
                $project: {
                    stockType: 1,
                    currentQuantity: 1,
                    lowStockThreshold: 1,
                    shortfall: {
                        $subtract: ['$lowStockThreshold', '$currentQuantity'],
                    },
                },
            },
            { $sort: { shortfall: -1 } },
        ])
    },

    /**
     * Get stock summary for a mill
     */
    async getStockSummary(millId) {
        return Stock.aggregate([
            { $match: { mill: new mongoose.Types.ObjectId(millId) } },
            {
                $group: {
                    _id: null,
                    totalStockTypes: { $sum: 1 },
                    totalCurrentQuantity: { $sum: '$currentQuantity' },
                    totalPurchased: { $sum: '$totalPurchased' },
                    totalSold: { $sum: '$totalSold' },
                    stocks: {
                        $push: {
                            stockType: '$stockType',
                            currentQuantity: '$currentQuantity',
                            totalPurchased: '$totalPurchased',
                            totalSold: '$totalSold',
                            lowStockThreshold: '$lowStockThreshold',
                            isLowStock: {
                                $lte: [
                                    '$currentQuantity',
                                    '$lowStockThreshold',
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalStockTypes: 1,
                    totalCurrentQuantity: 1,
                    totalPurchased: 1,
                    totalSold: 1,
                    stocks: 1,
                    lowStockCount: {
                        $size: {
                            $filter: {
                                input: '$stocks',
                                as: 'stock',
                                cond: { $eq: ['$$stock.isLowStock', true] },
                            },
                        },
                    },
                },
            },
        ])
    },

    /**
     * Stock transfer between types (e.g., PADDY to RICE after milling)
     */
    async transferStock({
        millId,
        fromStockType,
        toStockType,
        fromQuantity,
        toQuantity,
        note,
    }) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            // Check availability
            const availability = await this.checkAvailability(
                millId,
                fromStockType,
                fromQuantity
            )
            if (!availability.available) {
                throw new Error(
                    `Insufficient ${fromStockType} stock. Available: ${availability.currentQuantity}, Required: ${fromQuantity}`
                )
            }

            // Deduct from source
            await Stock.findOneAndUpdate(
                { mill: millId, stockType: fromStockType },
                {
                    $inc: { currentQuantity: -fromQuantity },
                },
                { session }
            )

            // Add to destination
            let destStock = await Stock.findOne({
                mill: millId,
                stockType: toStockType,
            })
            if (!destStock) {
                destStock = new Stock({
                    mill: millId,
                    stockType: toStockType,
                    currentQuantity: 0,
                    totalPurchased: 0,
                    totalSold: 0,
                })
            }
            destStock.currentQuantity += toQuantity
            await destStock.save({ session })

            await session.commitTransaction()

            return {
                from: { stockType: fromStockType, deducted: fromQuantity },
                to: { stockType: toStockType, added: toQuantity },
                note,
            }
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    },

    /**
     * Adjust stock manually (for corrections)
     */
    async adjustStock({ stockId, millId, adjustmentQuantity, reason }) {
        const stock = await Stock.findOne({
            _id: stockId,
            mill: millId,
        })

        if (!stock) {
            return null
        }

        stock.currentQuantity += adjustmentQuantity

        // Ensure quantity doesn't go negative
        if (stock.currentQuantity < 0) {
            stock.currentQuantity = 0
        }

        // Could log the adjustment reason here
        stock.lastAdjustment = {
            quantity: adjustmentQuantity,
            reason,
            date: new Date(),
        }

        return stock.save()
    },
}

export default StockService
