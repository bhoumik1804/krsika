import mongoose from 'mongoose'
import { StockOverview } from '../models/stock-overview.model.js'
import logger from '../utils/logger.js'

/**
 * Stock Overview Service
 * Business logic for stock overview operations
 */

/**
 * Create a new stock overview entry
 * @param {string} millId - Mill ID
 * @param {object} data - Stock overview data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created stock overview entry
 */
export const createStockOverviewEntry = async (millId, data, userId) => {
    try {
        const stockOverview = new StockOverview({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await stockOverview.save()

        logger.info('Stock overview entry created', {
            id: stockOverview._id,
            millId,
            userId,
        })

        return stockOverview
    } catch (error) {
        logger.error('Failed to create stock overview entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get stock overview entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Stock overview ID
 * @returns {Promise<object>} Stock overview entry
 */
export const getStockOverviewById = async (millId, id) => {
    try {
        const stockOverview = await StockOverview.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!stockOverview) {
            const error = new Error('Stock overview entry not found')
            error.statusCode = 404
            throw error
        }

        return stockOverview
    } catch (error) {
        logger.error('Failed to get stock overview entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get stock overview list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated stock overview list
 */
export const getStockOverviewList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (status) {
            matchStage.status = status
        }

        if (startDate || endDate) {
            matchStage.date = {}
            if (startDate) {
                matchStage.date.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        if (search) {
            matchStage.$or = [
                { partyName: { $regex: search, $options: 'i' } },
                { vehicleNumber: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = StockOverview.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdByUser',
                    pipeline: [{ $project: { fullName: 1, email: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$createdByUser',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])

        // Use aggregatePaginate for pagination
        const result = await StockOverview.aggregatePaginate(aggregate, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            customLabels: {
                docs: 'data',
                totalDocs: 'total',
                totalPages: 'totalPages',
                page: 'page',
                limit: 'limit',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage',
                prevPage: 'prevPage',
                nextPage: 'nextPage',
            },
        })

        return {
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
            },
        }
    } catch (error) {
        logger.error('Failed to get stock overview list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get stock overview summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getStockOverviewSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate } = options

        // Build match stage
        const match = { millId }
        if (startDate || endDate) {
            match.date = {}
            if (startDate) {
                match.date.$gte = new Date(startDate)
            }
            if (endDate) {
                match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        const [summary] = await StockOverview.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalBags: { $sum: '$bags' },
                    totalWeight: { $sum: '$weight' },
                    totalAmount: { $sum: '$amount' },
                    pendingCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
                        },
                    },
                    completedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
                        },
                    },
                    cancelledCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalBags: 1,
                    totalWeight: { $round: ['$totalWeight', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                    statusCounts: {
                        pending: '$pendingCount',
                        completed: '$completedCount',
                        cancelled: '$cancelledCount',
                    },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalBags: 0,
                totalWeight: 0,
                totalAmount: 0,
                statusCounts: {
                    pending: 0,
                    completed: 0,
                    cancelled: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get stock overview summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a stock overview entry
 * @param {string} millId - Mill ID
 * @param {string} id - Stock overview ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated stock overview entry
 */
export const updateStockOverviewEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const stockOverview = await StockOverview.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!stockOverview) {
            const error = new Error('Stock overview entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Stock overview entry updated', {
            id,
            millId,
            userId,
        })

        return stockOverview
    } catch (error) {
        logger.error('Failed to update stock overview entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a stock overview entry
 * @param {string} millId - Mill ID
 * @param {string} id - Stock overview ID
 * @returns {Promise<void>}
 */
export const deleteStockOverviewEntry = async (millId, id) => {
    try {
        const stockOverview = await StockOverview.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!stockOverview) {
            const error = new Error('Stock overview entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Stock overview entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete stock overview entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete stock overview entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of stock overview IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteStockOverviewEntries = async (millId, ids) => {
    try {
        const result = await StockOverview.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Stock overview entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete stock overview entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
