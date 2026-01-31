import mongoose from 'mongoose'
import { PrivateRiceOutward } from '../models/private-rice-outward.model.js'
import logger from '../utils/logger.js'

/**
 * Private Rice Outward Service
 * Business logic for private rice outward operations
 */

/**
 * Create a new private rice outward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Private rice outward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created private rice outward entry
 */
export const createPrivateRiceOutwardEntry = async (millId, data, userId) => {
    try {
        const privateRiceOutward = new PrivateRiceOutward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await privateRiceOutward.save()

        logger.info('Private rice outward entry created', {
            id: privateRiceOutward._id,
            millId,
            userId,
        })

        return privateRiceOutward
    } catch (error) {
        logger.error('Failed to create private rice outward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get private rice outward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Private rice outward ID
 * @returns {Promise<object>} Private rice outward entry
 */
export const getPrivateRiceOutwardById = async (millId, id) => {
    try {
        const privateRiceOutward = await PrivateRiceOutward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!privateRiceOutward) {
            const error = new Error('Private rice outward entry not found')
            error.statusCode = 404
            throw error
        }

        return privateRiceOutward
    } catch (error) {
        logger.error('Failed to get private rice outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get private rice outward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated private rice outward list
 */
export const getPrivateRiceOutwardList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            riceType,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (riceType) {
            matchStage.riceType = { $regex: riceType, $options: 'i' }
        }

        if (partyName) {
            matchStage.partyName = { $regex: partyName, $options: 'i' }
        }

        if (brokerName) {
            matchStage.brokerName = { $regex: brokerName, $options: 'i' }
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
                { brokerName: { $regex: search, $options: 'i' } },
                { truckNumber: { $regex: search, $options: 'i' } },
                { riceType: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = PrivateRiceOutward.aggregate([
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
        const result = await PrivateRiceOutward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get private rice outward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get private rice outward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getPrivateRiceOutwardSummary = async (millId, options = {}) => {
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

        const [summary] = await PrivateRiceOutward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalRiceGunny: { $sum: { $ifNull: ['$riceGunny', 0] } },
                    totalGrossWeight: {
                        $sum: { $ifNull: ['$grossWeight', 0] },
                    },
                    totalTareWeight: { $sum: { $ifNull: ['$tareWeight', 0] } },
                    totalNetWeight: { $sum: { $ifNull: ['$netWeight', 0] } },
                    totalRate: { $sum: { $ifNull: ['$rate', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalRiceGunny: { $round: ['$totalRiceGunny', 2] },
                    totalGrossWeight: { $round: ['$totalGrossWeight', 2] },
                    totalTareWeight: { $round: ['$totalTareWeight', 2] },
                    totalNetWeight: { $round: ['$totalNetWeight', 2] },
                    totalRate: { $round: ['$totalRate', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalRiceGunny: 0,
                totalGrossWeight: 0,
                totalTareWeight: 0,
                totalNetWeight: 0,
                totalRate: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get private rice outward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a private rice outward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Private rice outward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated private rice outward entry
 */
export const updatePrivateRiceOutwardEntry = async (
    millId,
    id,
    data,
    userId
) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const privateRiceOutward = await PrivateRiceOutward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!privateRiceOutward) {
            const error = new Error('Private rice outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Private rice outward entry updated', {
            id,
            millId,
            userId,
        })

        return privateRiceOutward
    } catch (error) {
        logger.error('Failed to update private rice outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a private rice outward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Private rice outward ID
 * @returns {Promise<void>}
 */
export const deletePrivateRiceOutwardEntry = async (millId, id) => {
    try {
        const privateRiceOutward = await PrivateRiceOutward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!privateRiceOutward) {
            const error = new Error('Private rice outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Private rice outward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete private rice outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete private rice outward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of private rice outward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeletePrivateRiceOutwardEntries = async (millId, ids) => {
    try {
        const result = await PrivateRiceOutward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Private rice outward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete private rice outward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
