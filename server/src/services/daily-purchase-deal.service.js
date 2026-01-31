import mongoose from 'mongoose'
import { DailyPurchaseDeal } from '../models/daily-purchase-deal.model.js'
import logger from '../utils/logger.js'

/**
 * Daily Purchase Deal Service
 * Business logic for daily purchase deal operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new daily purchase deal entry
 * @param {string} millId - Mill ID
 * @param {object} data - Daily purchase deal data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created daily purchase deal entry
 */
export const createDailyPurchaseDealEntry = async (millId, data, userId) => {
    try {
        const dailyPurchaseDeal = new DailyPurchaseDeal({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await dailyPurchaseDeal.save()

        logger.info('Daily purchase deal entry created', {
            id: dailyPurchaseDeal._id,
            millId,
            userId,
        })

        return dailyPurchaseDeal
    } catch (error) {
        logger.error('Failed to create daily purchase deal entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily purchase deal entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Daily purchase deal ID
 * @returns {Promise<object>} Daily purchase deal entry
 */
export const getDailyPurchaseDealById = async (millId, id) => {
    try {
        const dailyPurchaseDeal = await DailyPurchaseDeal.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyPurchaseDeal) {
            const error = new Error('Daily purchase deal entry not found')
            error.statusCode = 404
            throw error
        }

        return dailyPurchaseDeal
    } catch (error) {
        logger.error('Failed to get daily purchase deal entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily purchase deal list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated daily purchase deal list
 */
export const getDailyPurchaseDealList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            paymentStatus,
            status,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (paymentStatus) {
            matchStage.paymentStatus = paymentStatus
        }

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
                { farmerName: { $regex: search, $options: 'i' } },
                { commodity: { $regex: search, $options: 'i' } },
                { commodityType: { $regex: search, $options: 'i' } },
                { vehicleNumber: { $regex: search, $options: 'i' } },
                { brokerName: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = DailyPurchaseDeal.aggregate([
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
        const result = await DailyPurchaseDeal.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get daily purchase deal list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily purchase deal summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getDailyPurchaseDealSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (startDate || endDate) {
            matchStage.date = {}
            if (startDate) {
                matchStage.date.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        const summary = await DailyPurchaseDeal.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                totalDeals: { $sum: 1 },
                                totalQuantity: { $sum: '$quantity' },
                                totalAmount: { $sum: '$totalAmount' },
                                totalAdvance: { $sum: '$advanceAmount' },
                                totalBalance: { $sum: '$balanceAmount' },
                                totalBrokerCommission: {
                                    $sum: '$brokerCommission',
                                },
                            },
                        },
                    ],
                    paymentStatusCounts: [
                        {
                            $group: {
                                _id: '$paymentStatus',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    statusCounts: [
                        {
                            $group: {
                                _id: '$status',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                },
            },
        ])

        // Process results
        const totals = summary[0].totals[0] || {
            totalDeals: 0,
            totalQuantity: 0,
            totalAmount: 0,
            totalAdvance: 0,
            totalBalance: 0,
            totalBrokerCommission: 0,
        }

        const paymentStatusCounts = {
            pending: 0,
            partial: 0,
            paid: 0,
            cancelled: 0,
        }
        summary[0].paymentStatusCounts.forEach((item) => {
            if (item._id) {
                paymentStatusCounts[item._id] = item.count
            }
        })

        const statusCounts = {
            open: 0,
            closed: 0,
            cancelled: 0,
        }
        summary[0].statusCounts.forEach((item) => {
            if (item._id) {
                statusCounts[item._id] = item.count
            }
        })

        return {
            totalDeals: totals.totalDeals,
            totalQuantity: totals.totalQuantity,
            totalAmount: totals.totalAmount,
            totalAdvance: totals.totalAdvance,
            totalBalance: totals.totalBalance,
            totalBrokerCommission: totals.totalBrokerCommission,
            paymentStatusCounts,
            statusCounts,
        }
    } catch (error) {
        logger.error('Failed to get daily purchase deal summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a daily purchase deal entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily purchase deal ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated daily purchase deal entry
 */
export const updateDailyPurchaseDealEntry = async (
    millId,
    id,
    data,
    userId
) => {
    try {
        const updateData = { ...data, updatedBy: userId }

        // Convert date if provided
        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const dailyPurchaseDeal = await DailyPurchaseDeal.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyPurchaseDeal) {
            const error = new Error('Daily purchase deal entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily purchase deal entry updated', {
            id,
            millId,
            userId,
        })

        return dailyPurchaseDeal
    } catch (error) {
        logger.error('Failed to update daily purchase deal entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a daily purchase deal entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily purchase deal ID
 * @returns {Promise<void>}
 */
export const deleteDailyPurchaseDealEntry = async (millId, id) => {
    try {
        const dailyPurchaseDeal = await DailyPurchaseDeal.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!dailyPurchaseDeal) {
            const error = new Error('Daily purchase deal entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily purchase deal entry deleted', { id, millId })
    } catch (error) {
        logger.error('Failed to delete daily purchase deal entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete daily purchase deal entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of daily purchase deal IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteDailyPurchaseDealEntries = async (millId, ids) => {
    try {
        const result = await DailyPurchaseDeal.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Daily purchase deal entries bulk deleted', {
            millId,
            deletedCount: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete daily purchase deal entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
