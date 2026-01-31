import mongoose from 'mongoose'
import { FrkInward } from '../models/frk-inward.model.js'
import logger from '../utils/logger.js'

/**
 * FRK Inward Service
 * Business logic for FRK inward operations
 */

/**
 * Create a new FRK inward entry
 * @param {string} millId - Mill ID
 * @param {object} data - FRK inward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created FRK inward entry
 */
export const createFrkInwardEntry = async (millId, data, userId) => {
    try {
        const frkInward = new FrkInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await frkInward.save()

        logger.info('FRK inward entry created', {
            id: frkInward._id,
            millId,
            userId,
        })

        return frkInward
    } catch (error) {
        logger.error('Failed to create FRK inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK inward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - FRK inward ID
 * @returns {Promise<object>} FRK inward entry
 */
export const getFrkInwardById = async (millId, id) => {
    try {
        const frkInward = await FrkInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!frkInward) {
            const error = new Error('FRK inward entry not found')
            error.statusCode = 404
            throw error
        }

        return frkInward
    } catch (error) {
        logger.error('Failed to get FRK inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK inward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated FRK inward list
 */
export const getFrkInwardList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            partyName,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (partyName) {
            matchStage.partyName = { $regex: partyName, $options: 'i' }
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
            matchStage.$or = [{ partyName: { $regex: search, $options: 'i' } }]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = FrkInward.aggregate([
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
        const result = await FrkInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get FRK inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK inward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getFrkInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await FrkInward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalWeight: { $sum: { $ifNull: ['$totalWeight', 0] } },
                    totalRate: { $sum: { $ifNull: ['$rate', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalWeight: { $round: ['$totalWeight', 2] },
                    totalRate: { $round: ['$totalRate', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalWeight: 0,
                totalRate: 0,
                totalAmount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get FRK inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a FRK inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - FRK inward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated FRK inward entry
 */
export const updateFrkInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const frkInward = await FrkInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!frkInward) {
            const error = new Error('FRK inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('FRK inward entry updated', {
            id,
            millId,
            userId,
        })

        return frkInward
    } catch (error) {
        logger.error('Failed to update FRK inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a FRK inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - FRK inward ID
 * @returns {Promise<void>}
 */
export const deleteFrkInwardEntry = async (millId, id) => {
    try {
        const frkInward = await FrkInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!frkInward) {
            const error = new Error('FRK inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('FRK inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete FRK inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete FRK inward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of FRK inward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteFrkInwardEntries = async (millId, ids) => {
    try {
        const result = await FrkInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('FRK inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete FRK inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
