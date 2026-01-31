import mongoose from 'mongoose'
import { DailyOutward } from '../models/daily-outward.model.js'
import logger from '../utils/logger.js'

/**
 * Daily Outward Service
 * Business logic for daily outward operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new daily outward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Daily outward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created daily outward entry
 */
export const createDailyOutwardEntry = async (millId, data, userId) => {
    try {
        const dailyOutward = new DailyOutward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await dailyOutward.save()

        logger.info('Daily outward entry created', {
            id: dailyOutward._id,
            millId,
            userId,
        })

        return dailyOutward
    } catch (error) {
        logger.error('Failed to create daily outward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily outward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Daily outward ID
 * @returns {Promise<object>} Daily outward entry
 */
export const getDailyOutwardById = async (millId, id) => {
    try {
        const dailyOutward = await DailyOutward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyOutward) {
            const error = new Error('Daily outward entry not found')
            error.statusCode = 404
            throw error
        }

        return dailyOutward
    } catch (error) {
        logger.error('Failed to get daily outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily outward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated daily outward list
 */
export const getDailyOutwardList = async (millId, options = {}) => {
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
                { gatePassNumber: { $regex: search, $options: 'i' } },
                { item: { $regex: search, $options: 'i' } },
                { driverName: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = DailyOutward.aggregate([
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
        const result = await DailyOutward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get daily outward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily outward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getDailyOutwardSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate } = options

        // Build match stage
        const match = { millId: new mongoose.Types.ObjectId(millId) }
        if (startDate || endDate) {
            match.date = {}
            if (startDate) {
                match.date.$gte = new Date(startDate)
            }
            if (endDate) {
                match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        const [summary] = await DailyOutward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalBags: { $sum: '$bags' },
                    totalWeight: { $sum: '$weight' },
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
                    dispatchedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'dispatched'] }, 1, 0],
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
                    statusCounts: {
                        pending: '$pendingCount',
                        completed: '$completedCount',
                        dispatched: '$dispatchedCount',
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
                statusCounts: {
                    pending: 0,
                    completed: 0,
                    dispatched: 0,
                    cancelled: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get daily outward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a daily outward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily outward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated daily outward entry
 */
export const updateDailyOutwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const dailyOutward = await DailyOutward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyOutward) {
            const error = new Error('Daily outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily outward entry updated', {
            id,
            millId,
            userId,
        })

        return dailyOutward
    } catch (error) {
        logger.error('Failed to update daily outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a daily outward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily outward ID
 * @returns {Promise<void>}
 */
export const deleteDailyOutwardEntry = async (millId, id) => {
    try {
        const dailyOutward = await DailyOutward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!dailyOutward) {
            const error = new Error('Daily outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily outward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete daily outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete daily outward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of daily outward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteDailyOutwardEntries = async (millId, ids) => {
    try {
        const result = await DailyOutward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Daily outward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete daily outward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
