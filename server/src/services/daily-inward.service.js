import mongoose from 'mongoose'
import { DailyInward } from '../models/daily-inward.model.js'
import logger from '../utils/logger.js'

/**
 * Daily Inward Service
 * Business logic for daily inward operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new daily inward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Daily inward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created daily inward entry
 */
export const createDailyInwardEntry = async (millId, data, userId) => {
    try {
        const dailyInward = new DailyInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await dailyInward.save()

        logger.info('Daily inward entry created', {
            id: dailyInward._id,
            millId,
            userId,
        })

        return dailyInward
    } catch (error) {
        logger.error('Failed to create daily inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily inward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Daily inward ID
 * @returns {Promise<object>} Daily inward entry
 */
export const getDailyInwardById = async (millId, id) => {
    try {
        const dailyInward = await DailyInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyInward) {
            const error = new Error('Daily inward entry not found')
            error.statusCode = 404
            throw error
        }

        return dailyInward
    } catch (error) {
        logger.error('Failed to get daily inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily inward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated daily inward list
 */
export const getDailyInwardList = async (millId, options = {}) => {
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
        const aggregate = DailyInward.aggregate([
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
        const result = await DailyInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get daily inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}


/**
 * Get daily inward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getDailyInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await DailyInward.aggregate([
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
                    verifiedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'verified'] }, 1, 0],
                        },
                    },
                    rejectedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
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
                        verified: '$verifiedCount',
                        rejected: '$rejectedCount',
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
                    verified: 0,
                    rejected: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get daily inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a daily inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily inward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated daily inward entry
 */
export const updateDailyInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const dailyInward = await DailyInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyInward) {
            const error = new Error('Daily inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily inward entry updated', {
            id,
            millId,
            userId,
        })

        return dailyInward
    } catch (error) {
        logger.error('Failed to update daily inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a daily inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily inward ID
 * @returns {Promise<void>}
 */
export const deleteDailyInwardEntry = async (millId, id) => {
    try {
        const dailyInward = await DailyInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!dailyInward) {
            const error = new Error('Daily inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete daily inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete daily inward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of daily inward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteDailyInwardEntries = async (millId, ids) => {
    try {
        const result = await DailyInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Daily inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete daily inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
