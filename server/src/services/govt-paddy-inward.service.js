import mongoose from 'mongoose'
import { GovtPaddyInward } from '../models/govt-paddy-inward.model.js'
import logger from '../utils/logger.js'

/**
 * Govt Paddy Inward Service
 * Business logic for govt paddy inward operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new govt paddy inward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Govt paddy inward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created govt paddy inward entry
 */
export const createGovtPaddyInwardEntry = async (millId, data, userId) => {
    try {
        const govtPaddyInward = new GovtPaddyInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await govtPaddyInward.save()

        logger.info('Govt paddy inward entry created', {
            id: govtPaddyInward._id,
            millId,
            userId,
        })

        return govtPaddyInward
    } catch (error) {
        logger.error('Failed to create govt paddy inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get govt paddy inward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Govt paddy inward ID
 * @returns {Promise<object>} Govt paddy inward entry
 */
export const getGovtPaddyInwardById = async (millId, id) => {
    try {
        const govtPaddyInward = await GovtPaddyInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!govtPaddyInward) {
            const error = new Error('Govt paddy inward entry not found')
            error.statusCode = 404
            throw error
        }

        return govtPaddyInward
    } catch (error) {
        logger.error('Failed to get govt paddy inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get govt paddy inward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated govt paddy inward list
 */
export const getGovtPaddyInwardList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            paddyType,
            committeeName,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (paddyType) {
            matchStage.paddyType = { $regex: paddyType, $options: 'i' }
        }

        if (committeeName) {
            matchStage.committeeName = { $regex: committeeName, $options: 'i' }
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
                { doNumber: { $regex: search, $options: 'i' } },
                { committeeName: { $regex: search, $options: 'i' } },
                { truckNumber: { $regex: search, $options: 'i' } },
                { rstNumber: { $regex: search, $options: 'i' } },
                { paddyType: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = GovtPaddyInward.aggregate([
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
        const result = await GovtPaddyInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get govt paddy inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get govt paddy inward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getGovtPaddyInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await GovtPaddyInward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalBalanceDo: { $sum: { $ifNull: ['$balanceDo', 0] } },
                    totalGunnyNew: { $sum: { $ifNull: ['$gunnyNew', 0] } },
                    totalGunnyOld: { $sum: { $ifNull: ['$gunnyOld', 0] } },
                    totalGunnyPlastic: {
                        $sum: { $ifNull: ['$gunnyPlastic', 0] },
                    },
                    totalJuteWeight: { $sum: { $ifNull: ['$juteWeight', 0] } },
                    totalPlasticWeight: {
                        $sum: { $ifNull: ['$plasticWeight', 0] },
                    },
                    totalGunnyWeight: {
                        $sum: { $ifNull: ['$gunnyWeight', 0] },
                    },
                    totalTruckLoadWeight: {
                        $sum: { $ifNull: ['$truckLoadWeight', 0] },
                    },
                    totalPaddyMota: { $sum: { $ifNull: ['$paddyMota', 0] } },
                    totalPaddyPatla: { $sum: { $ifNull: ['$paddyPatla', 0] } },
                    totalPaddySarna: { $sum: { $ifNull: ['$paddySarna', 0] } },
                    totalPaddyMahamaya: {
                        $sum: { $ifNull: ['$paddyMahamaya', 0] },
                    },
                    totalPaddyRbGold: {
                        $sum: { $ifNull: ['$paddyRbGold', 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalBalanceDo: { $round: ['$totalBalanceDo', 2] },
                    totalGunnyNew: { $round: ['$totalGunnyNew', 2] },
                    totalGunnyOld: { $round: ['$totalGunnyOld', 2] },
                    totalGunnyPlastic: { $round: ['$totalGunnyPlastic', 2] },
                    totalJuteWeight: { $round: ['$totalJuteWeight', 2] },
                    totalPlasticWeight: { $round: ['$totalPlasticWeight', 2] },
                    totalGunnyWeight: { $round: ['$totalGunnyWeight', 2] },
                    totalTruckLoadWeight: {
                        $round: ['$totalTruckLoadWeight', 2],
                    },
                    totalPaddyMota: { $round: ['$totalPaddyMota', 2] },
                    totalPaddyPatla: { $round: ['$totalPaddyPatla', 2] },
                    totalPaddySarna: { $round: ['$totalPaddySarna', 2] },
                    totalPaddyMahamaya: { $round: ['$totalPaddyMahamaya', 2] },
                    totalPaddyRbGold: { $round: ['$totalPaddyRbGold', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalBalanceDo: 0,
                totalGunnyNew: 0,
                totalGunnyOld: 0,
                totalGunnyPlastic: 0,
                totalJuteWeight: 0,
                totalPlasticWeight: 0,
                totalGunnyWeight: 0,
                totalTruckLoadWeight: 0,
                totalPaddyMota: 0,
                totalPaddyPatla: 0,
                totalPaddySarna: 0,
                totalPaddyMahamaya: 0,
                totalPaddyRbGold: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get govt paddy inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a govt paddy inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Govt paddy inward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated govt paddy inward entry
 */
export const updateGovtPaddyInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const govtPaddyInward = await GovtPaddyInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!govtPaddyInward) {
            const error = new Error('Govt paddy inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Govt paddy inward entry updated', {
            id,
            millId,
            userId,
        })

        return govtPaddyInward
    } catch (error) {
        logger.error('Failed to update govt paddy inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a govt paddy inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Govt paddy inward ID
 * @returns {Promise<void>}
 */
export const deleteGovtPaddyInwardEntry = async (millId, id) => {
    try {
        const govtPaddyInward = await GovtPaddyInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!govtPaddyInward) {
            const error = new Error('Govt paddy inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Govt paddy inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete govt paddy inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete govt paddy inward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of govt paddy inward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteGovtPaddyInwardEntries = async (millId, ids) => {
    try {
        const result = await GovtPaddyInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Govt paddy inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete govt paddy inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
