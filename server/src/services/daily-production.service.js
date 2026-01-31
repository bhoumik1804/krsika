import mongoose from 'mongoose'
import { DailyProduction } from '../models/daily-production.model.js'
import logger from '../utils/logger.js'

/**
 * Daily Production Service
 * Business logic for daily production operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new daily production entry
 * @param {string} millId - Mill ID
 * @param {object} data - Daily production data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created daily production entry
 */
export const createDailyProductionEntry = async (millId, data, userId) => {
    try {
        const dailyProduction = new DailyProduction({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await dailyProduction.save()

        logger.info('Daily production entry created', {
            id: dailyProduction._id,
            millId,
            userId,
        })

        return dailyProduction
    } catch (error) {
        logger.error('Failed to create daily production entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily production entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Daily production ID
 * @returns {Promise<object>} Daily production entry
 */
export const getDailyProductionById = async (millId, id) => {
    try {
        const dailyProduction = await DailyProduction.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyProduction) {
            const error = new Error('Daily production entry not found')
            error.statusCode = 404
            throw error
        }

        return dailyProduction
    } catch (error) {
        logger.error('Failed to get daily production entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily production list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated daily production list
 */
export const getDailyProductionList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            itemType,
            warehouse,
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

        if (itemType) {
            matchStage.itemType = itemType
        }

        if (warehouse) {
            matchStage.warehouse = warehouse
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
                { itemName: { $regex: search, $options: 'i' } },
                { itemType: { $regex: search, $options: 'i' } },
                { warehouse: { $regex: search, $options: 'i' } },
                { stackNumber: { $regex: search, $options: 'i' } },
                { remarks: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = DailyProduction.aggregate([
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
            {
                $lookup: {
                    from: 'users',
                    localField: 'updatedBy',
                    foreignField: '_id',
                    as: 'updatedByUser',
                    pipeline: [{ $project: { fullName: 1, email: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$updatedByUser',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    createdBy: '$createdByUser',
                    updatedBy: '$updatedByUser',
                },
            },
            {
                $project: {
                    createdByUser: 0,
                    updatedByUser: 0,
                },
            },
        ])

        // Use aggregatePaginate for pagination
        const result = await DailyProduction.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get daily production list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily production summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getDailyProductionSummary = async (millId, options = {}) => {
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

        const [summary] = await DailyProduction.aggregate([
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
                    verifiedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'verified'] }, 1, 0],
                        },
                    },
                    stockedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'stocked'] }, 1, 0],
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
                        verified: '$verifiedCount',
                        stocked: '$stockedCount',
                        rejected: '$rejectedCount',
                    },
                },
            },
        ])

        // Get item type counts
        const itemTypeCounts = await DailyProduction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$itemType',
                    count: { $sum: 1 },
                },
            },
        ])

        // Get warehouse counts
        const warehouseCounts = await DailyProduction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$warehouse',
                    count: { $sum: 1 },
                },
            },
        ])

        // Convert arrays to objects
        const itemTypeCountsObj = itemTypeCounts.reduce((acc, item) => {
            acc[item._id] = item.count
            return acc
        }, {})

        const warehouseCountsObj = warehouseCounts.reduce((acc, item) => {
            acc[item._id] = item.count
            return acc
        }, {})

        // Return default values if no data found
        return summary
            ? {
                  ...summary,
                  itemTypeCounts: itemTypeCountsObj,
                  warehouseCounts: warehouseCountsObj,
              }
            : {
                  totalEntries: 0,
                  totalBags: 0,
                  totalWeight: 0,
                  statusCounts: {
                      pending: 0,
                      verified: 0,
                      stocked: 0,
                      rejected: 0,
                  },
                  itemTypeCounts: {},
                  warehouseCounts: {},
              }
    } catch (error) {
        logger.error('Failed to get daily production summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a daily production entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily production ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated daily production entry
 */
export const updateDailyProductionEntry = async (millId, id, data, userId) => {
    try {
        // Convert date string to Date object if provided
        const updateData = { ...data }
        if (data.date) {
            updateData.date = new Date(data.date)
        }
        updateData.updatedBy = userId

        const dailyProduction = await DailyProduction.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyProduction) {
            const error = new Error('Daily production entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily production entry updated', {
            id,
            millId,
            userId,
        })

        return dailyProduction
    } catch (error) {
        logger.error('Failed to update daily production entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a daily production entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily production ID
 * @returns {Promise<object>} Deleted daily production entry
 */
export const deleteDailyProductionEntry = async (millId, id) => {
    try {
        const dailyProduction = await DailyProduction.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!dailyProduction) {
            const error = new Error('Daily production entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily production entry deleted', {
            id,
            millId,
        })

        return dailyProduction
    } catch (error) {
        logger.error('Failed to delete daily production entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete daily production entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of daily production IDs
 * @returns {Promise<object>} Delete result
 */
export const bulkDeleteDailyProductionEntries = async (millId, ids) => {
    try {
        const result = await DailyProduction.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Daily production entries bulk deleted', {
            millId,
            count: result.deletedCount,
            requestedIds: ids.length,
        })

        return {
            deletedCount: result.deletedCount,
            requestedCount: ids.length,
        }
    } catch (error) {
        logger.error('Failed to bulk delete daily production entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
