import mongoose from 'mongoose'
import { RiceInward } from '../models/rice-inward.model.js'
import logger from '../utils/logger.js'

/**
 * Rice Inward Service
 * Business logic for rice inward operations
 */

/**
 * Create a new rice inward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Rice inward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created rice inward entry
 */
export const createRiceInwardEntry = async (millId, data, userId) => {
    try {
        const riceInward = new RiceInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await riceInward.save()

        logger.info('Rice inward entry created', {
            id: riceInward._id,
            millId,
            userId,
        })

        return riceInward
    } catch (error) {
        logger.error('Failed to create rice inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice inward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Rice inward ID
 * @returns {Promise<object>} Rice inward entry
 */
export const getRiceInwardById = async (millId, id) => {
    try {
        const riceInward = await RiceInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!riceInward) {
            const error = new Error('Rice inward entry not found')
            error.statusCode = 404
            throw error
        }

        return riceInward
    } catch (error) {
        logger.error('Failed to get rice inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice inward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated rice inward list
 */
export const getRiceInwardList = async (millId, options = {}) => {
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
        const aggregate = RiceInward.aggregate([
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
        const result = await RiceInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get rice inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice inward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getRiceInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await RiceInward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalRiceGunny: { $sum: { $ifNull: ['$riceGunny', 0] } },
                    totalFrk: { $sum: { $ifNull: ['$frk', 0] } },
                    totalSampleWeight: {
                        $sum: { $ifNull: ['$sampleWeight', 0] },
                    },
                    totalGrossWeight: {
                        $sum: { $ifNull: ['$grossWeight', 0] },
                    },
                    totalTareWeight: { $sum: { $ifNull: ['$tareWeight', 0] } },
                    totalNetWeight: { $sum: { $ifNull: ['$netWeight', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalRiceGunny: { $round: ['$totalRiceGunny', 2] },
                    totalFrk: { $round: ['$totalFrk', 2] },
                    totalSampleWeight: { $round: ['$totalSampleWeight', 2] },
                    totalGrossWeight: { $round: ['$totalGrossWeight', 2] },
                    totalTareWeight: { $round: ['$totalTareWeight', 2] },
                    totalNetWeight: { $round: ['$totalNetWeight', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalRiceGunny: 0,
                totalFrk: 0,
                totalSampleWeight: 0,
                totalGrossWeight: 0,
                totalTareWeight: 0,
                totalNetWeight: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get rice inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a rice inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Rice inward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated rice inward entry
 */
export const updateRiceInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const riceInward = await RiceInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!riceInward) {
            const error = new Error('Rice inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Rice inward entry updated', {
            id,
            millId,
            userId,
        })

        return riceInward
    } catch (error) {
        logger.error('Failed to update rice inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a rice inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Rice inward ID
 * @returns {Promise<void>}
 */
export const deleteRiceInwardEntry = async (millId, id) => {
    try {
        const riceInward = await RiceInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!riceInward) {
            const error = new Error('Rice inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Rice inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete rice inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete rice inward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of rice inward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteRiceInwardEntries = async (millId, ids) => {
    try {
        const result = await RiceInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Rice inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete rice inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
