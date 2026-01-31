import mongoose from 'mongoose'
import { DailyMilling } from '../models/daily-milling.model.js'
import logger from '../utils/logger.js'

/**
 * Daily Milling Service
 * Business logic for daily milling operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new daily milling entry
 * @param {string} millId - Mill ID
 * @param {object} data - Daily milling data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created daily milling entry
 */
export const createDailyMillingEntry = async (millId, data, userId) => {
    try {
        const dailyMilling = new DailyMilling({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await dailyMilling.save()

        logger.info('Daily milling entry created', {
            id: dailyMilling._id,
            millId,
            userId,
        })

        return dailyMilling
    } catch (error) {
        logger.error('Failed to create daily milling entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily milling entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Daily milling ID
 * @returns {Promise<object>} Daily milling entry
 */
export const getDailyMillingById = async (millId, id) => {
    try {
        const dailyMilling = await DailyMilling.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyMilling) {
            const error = new Error('Daily milling entry not found')
            error.statusCode = 404
            throw error
        }

        return dailyMilling
    } catch (error) {
        logger.error('Failed to get daily milling entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily milling list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated daily milling list
 */
export const getDailyMillingList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            shift,
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

        if (shift) {
            matchStage.shift = shift
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
                { paddyType: { $regex: search, $options: 'i' } },
                { remarks: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = DailyMilling.aggregate([
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
        const result = await DailyMilling.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get daily milling list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily milling summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getDailyMillingSummary = async (millId, options = {}) => {
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

        const [summary] = await DailyMilling.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalPaddyQuantity: { $sum: '$paddyQuantity' },
                    totalRiceYield: { $sum: '$riceYield' },
                    totalBrokenYield: { $sum: '$brokenYield' },
                    totalBranYield: { $sum: '$branYield' },
                    totalHuskYield: { $sum: '$huskYield' },
                    scheduledCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0],
                        },
                    },
                    inProgressCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0],
                        },
                    },
                    completedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
                        },
                    },
                    haltedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'halted'] }, 1, 0],
                        },
                    },
                    dayShiftCount: {
                        $sum: {
                            $cond: [{ $eq: ['$shift', 'Day'] }, 1, 0],
                        },
                    },
                    nightShiftCount: {
                        $sum: {
                            $cond: [{ $eq: ['$shift', 'Night'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalPaddyQuantity: { $round: ['$totalPaddyQuantity', 2] },
                    totalRiceYield: { $round: ['$totalRiceYield', 2] },
                    totalBrokenYield: { $round: ['$totalBrokenYield', 2] },
                    totalBranYield: { $round: ['$totalBranYield', 2] },
                    totalHuskYield: { $round: ['$totalHuskYield', 2] },
                    statusCounts: {
                        scheduled: '$scheduledCount',
                        'in-progress': '$inProgressCount',
                        completed: '$completedCount',
                        halted: '$haltedCount',
                    },
                    shiftCounts: {
                        Day: '$dayShiftCount',
                        Night: '$nightShiftCount',
                    },
                },
            },
        ])

        // Return default values if no data found
        return (
            summary || {
                totalEntries: 0,
                totalPaddyQuantity: 0,
                totalRiceYield: 0,
                totalBrokenYield: 0,
                totalBranYield: 0,
                totalHuskYield: 0,
                statusCounts: {
                    scheduled: 0,
                    'in-progress': 0,
                    completed: 0,
                    halted: 0,
                },
                shiftCounts: {
                    Day: 0,
                    Night: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get daily milling summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a daily milling entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily milling ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated daily milling entry
 */
export const updateDailyMillingEntry = async (millId, id, data, userId) => {
    try {
        // Convert date string to Date object if provided
        const updateData = { ...data }
        if (data.date) {
            updateData.date = new Date(data.date)
        }
        updateData.updatedBy = userId

        const dailyMilling = await DailyMilling.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyMilling) {
            const error = new Error('Daily milling entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily milling entry updated', {
            id,
            millId,
            userId,
        })

        return dailyMilling
    } catch (error) {
        logger.error('Failed to update daily milling entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a daily milling entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily milling ID
 * @returns {Promise<object>} Deleted daily milling entry
 */
export const deleteDailyMillingEntry = async (millId, id) => {
    try {
        const dailyMilling = await DailyMilling.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!dailyMilling) {
            const error = new Error('Daily milling entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily milling entry deleted', {
            id,
            millId,
        })

        return dailyMilling
    } catch (error) {
        logger.error('Failed to delete daily milling entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete daily milling entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of daily milling IDs
 * @returns {Promise<object>} Delete result
 */
export const bulkDeleteDailyMillingEntries = async (millId, ids) => {
    try {
        const result = await DailyMilling.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Daily milling entries bulk deleted', {
            millId,
            count: result.deletedCount,
            requestedIds: ids.length,
        })

        return {
            deletedCount: result.deletedCount,
            requestedCount: ids.length,
        }
    } catch (error) {
        logger.error('Failed to bulk delete daily milling entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
