import mongoose from 'mongoose'
import { GunnyInward } from '../models/gunny-inward.model.js'
import logger from '../utils/logger.js'

/**
 * Gunny Inward Service
 * Business logic for gunny inward operations
 */

/**
 * Create a new gunny inward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Gunny inward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created gunny inward entry
 */
export const createGunnyInwardEntry = async (millId, data, userId) => {
    try {
        const gunnyInward = new GunnyInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await gunnyInward.save()

        logger.info('Gunny inward entry created', {
            id: gunnyInward._id,
            millId,
            userId,
        })

        return gunnyInward
    } catch (error) {
        logger.error('Failed to create gunny inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny inward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Gunny inward ID
 * @returns {Promise<object>} Gunny inward entry
 */
export const getGunnyInwardById = async (millId, id) => {
    try {
        const gunnyInward = await GunnyInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!gunnyInward) {
            const error = new Error('Gunny inward entry not found')
            error.statusCode = 404
            throw error
        }

        return gunnyInward
    } catch (error) {
        logger.error('Failed to get gunny inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny inward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated gunny inward list
 */
export const getGunnyInwardList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            gunnyType,
            partyName,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (gunnyType) {
            matchStage.gunnyType = { $regex: gunnyType, $options: 'i' }
        }

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
            matchStage.$or = [
                { partyName: { $regex: search, $options: 'i' } },
                { gunnyType: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = GunnyInward.aggregate([
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
        const result = await GunnyInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get gunny inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny inward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getGunnyInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await GunnyInward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalGunny: { $sum: { $ifNull: ['$totalGunny', 0] } },
                    totalRate: { $sum: { $ifNull: ['$rate', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalGunny: { $round: ['$totalGunny', 2] },
                    totalRate: { $round: ['$totalRate', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalGunny: 0,
                totalRate: 0,
                totalAmount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get gunny inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a gunny inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Gunny inward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated gunny inward entry
 */
export const updateGunnyInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const gunnyInward = await GunnyInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!gunnyInward) {
            const error = new Error('Gunny inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Gunny inward entry updated', {
            id,
            millId,
            userId,
        })

        return gunnyInward
    } catch (error) {
        logger.error('Failed to update gunny inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a gunny inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Gunny inward ID
 * @returns {Promise<void>}
 */
export const deleteGunnyInwardEntry = async (millId, id) => {
    try {
        const gunnyInward = await GunnyInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!gunnyInward) {
            const error = new Error('Gunny inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Gunny inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete gunny inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete gunny inward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of gunny inward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteGunnyInwardEntries = async (millId, ids) => {
    try {
        const result = await GunnyInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Gunny inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete gunny inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
