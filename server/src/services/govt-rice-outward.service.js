import mongoose from 'mongoose'
import { GovtRiceOutward } from '../models/govt-rice-outward.model.js'
import logger from '../utils/logger.js'

/**
 * Govt Rice Outward Service
 * Business logic for govt rice outward operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new govt rice outward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Govt rice outward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created govt rice outward entry
 */
export const createGovtRiceOutwardEntry = async (millId, data, userId) => {
    try {
        const govtRiceOutward = new GovtRiceOutward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await govtRiceOutward.save()

        logger.info('Govt rice outward entry created', {
            id: govtRiceOutward._id,
            millId,
            userId,
        })

        return govtRiceOutward
    } catch (error) {
        logger.error('Failed to create govt rice outward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get govt rice outward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Govt rice outward ID
 * @returns {Promise<object>} Govt rice outward entry
 */
export const getGovtRiceOutwardById = async (millId, id) => {
    try {
        const govtRiceOutward = await GovtRiceOutward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!govtRiceOutward) {
            const error = new Error('Govt rice outward entry not found')
            error.statusCode = 404
            throw error
        }

        return govtRiceOutward
    } catch (error) {
        logger.error('Failed to get govt rice outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get govt rice outward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated govt rice outward list
 */
export const getGovtRiceOutwardList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            riceType,
            lotNo,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (riceType) {
            matchStage.riceType = riceType
        }

        if (lotNo) {
            matchStage.lotNo = lotNo
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
                { lotNo: { $regex: search, $options: 'i' } },
                { fciNan: { $regex: search, $options: 'i' } },
                { riceType: { $regex: search, $options: 'i' } },
                { truckNo: { $regex: search, $options: 'i' } },
                { truckRst: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = GovtRiceOutward.aggregate([
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
        const result = await GovtRiceOutward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get govt rice outward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get govt rice outward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getGovtRiceOutwardSummary = async (millId, options = {}) => {
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

        const [summary] = await GovtRiceOutward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalGunnyNew: { $sum: { $ifNull: ['$gunnyNew', 0] } },
                    totalGunnyOld: { $sum: { $ifNull: ['$gunnyOld', 0] } },
                    totalJuteWeight: { $sum: { $ifNull: ['$juteWeight', 0] } },
                    totalTruckWeight: {
                        $sum: { $ifNull: ['$truckWeight', 0] },
                    },
                    totalGunnyWeight: {
                        $sum: { $ifNull: ['$gunnyWeight', 0] },
                    },
                    totalNetWeight: { $sum: { $ifNull: ['$netWeight', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalGunnyNew: 1,
                    totalGunnyOld: 1,
                    totalJuteWeight: { $round: ['$totalJuteWeight', 2] },
                    totalTruckWeight: { $round: ['$totalTruckWeight', 2] },
                    totalGunnyWeight: { $round: ['$totalGunnyWeight', 2] },
                    totalNetWeight: { $round: ['$totalNetWeight', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalGunnyNew: 0,
                totalGunnyOld: 0,
                totalJuteWeight: 0,
                totalTruckWeight: 0,
                totalGunnyWeight: 0,
                totalNetWeight: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get govt rice outward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a govt rice outward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Govt rice outward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated govt rice outward entry
 */
export const updateGovtRiceOutwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const govtRiceOutward = await GovtRiceOutward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!govtRiceOutward) {
            const error = new Error('Govt rice outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Govt rice outward entry updated', {
            id,
            millId,
            userId,
        })

        return govtRiceOutward
    } catch (error) {
        logger.error('Failed to update govt rice outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a govt rice outward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Govt rice outward ID
 * @returns {Promise<void>}
 */
export const deleteGovtRiceOutwardEntry = async (millId, id) => {
    try {
        const govtRiceOutward = await GovtRiceOutward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!govtRiceOutward) {
            const error = new Error('Govt rice outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Govt rice outward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete govt rice outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete govt rice outward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of govt rice outward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteGovtRiceOutwardEntries = async (millId, ids) => {
    try {
        const result = await GovtRiceOutward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Govt rice outward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete govt rice outward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
