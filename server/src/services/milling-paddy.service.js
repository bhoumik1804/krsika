import mongoose from 'mongoose'
import { MillingPaddy } from '../models/milling-paddy.model.js'
import logger from '../utils/logger.js'

/**
 * Milling Paddy Service
 * Business logic for milling paddy operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new milling paddy entry
 * @param {string} millId - Mill ID
 * @param {object} data - Milling paddy data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created milling paddy entry
 */
export const createMillingPaddyEntry = async (millId, data, userId) => {
    try {
        const millingPaddy = new MillingPaddy({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await millingPaddy.save()

        logger.info('Milling paddy entry created', {
            id: millingPaddy._id,
            millId,
            userId,
        })

        return millingPaddy
    } catch (error) {
        logger.error('Failed to create milling paddy entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get milling paddy entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Milling paddy ID
 * @returns {Promise<object>} Milling paddy entry
 */
export const getMillingPaddyById = async (millId, id) => {
    try {
        const millingPaddy = await MillingPaddy.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!millingPaddy) {
            const error = new Error('Milling paddy entry not found')
            error.statusCode = 404
            throw error
        }

        return millingPaddy
    } catch (error) {
        logger.error('Failed to get milling paddy entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get milling paddy list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated milling paddy list
 */
export const getMillingPaddyList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            paddyType,
            riceType,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (paddyType) {
            matchStage.paddyType = paddyType
        }

        if (riceType) {
            matchStage.riceType = riceType
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
                { riceType: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = MillingPaddy.aggregate([
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
        ])

        // Use aggregatePaginate for pagination
        const result = await MillingPaddy.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get milling paddy list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get milling paddy summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getMillingPaddySummary = async (millId, options = {}) => {
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

        const [summary] = await MillingPaddy.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalHopperInGunny: { $sum: '$hopperInGunny' },
                    totalHopperInQintal: { $sum: '$hopperInQintal' },
                    totalRiceQuantity: { $sum: '$riceQuantity' },
                    totalKhandaQuantity: { $sum: '$khandaQuantity' },
                    totalKodhaQuantity: { $sum: '$kodhaQuantity' },
                    totalBhusaTon: { $sum: '$bhusaTon' },
                    totalNakkhiQuantity: { $sum: '$nakkhiQuantity' },
                    avgRicePercentage: { $avg: '$ricePercentage' },
                    avgKhandaPercentage: { $avg: '$khandaPercentage' },
                    avgKodhaPercentage: { $avg: '$kodhaPercentage' },
                    avgBhusaPercentage: { $avg: '$bhusaPercentage' },
                    avgNakkhiPercentage: { $avg: '$nakkhiPercentage' },
                    avgWastagePercentage: { $avg: '$wastagePercentage' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalHopperInGunny: { $round: ['$totalHopperInGunny', 2] },
                    totalHopperInQintal: {
                        $round: ['$totalHopperInQintal', 2],
                    },
                    totalRiceQuantity: { $round: ['$totalRiceQuantity', 2] },
                    totalKhandaQuantity: {
                        $round: ['$totalKhandaQuantity', 2],
                    },
                    totalKodhaQuantity: { $round: ['$totalKodhaQuantity', 2] },
                    totalBhusaTon: { $round: ['$totalBhusaTon', 2] },
                    totalNakkhiQuantity: {
                        $round: ['$totalNakkhiQuantity', 2],
                    },
                    avgRicePercentage: { $round: ['$avgRicePercentage', 2] },
                    avgKhandaPercentage: {
                        $round: ['$avgKhandaPercentage', 2],
                    },
                    avgKodhaPercentage: { $round: ['$avgKodhaPercentage', 2] },
                    avgBhusaPercentage: { $round: ['$avgBhusaPercentage', 2] },
                    avgNakkhiPercentage: {
                        $round: ['$avgNakkhiPercentage', 2],
                    },
                    avgWastagePercentage: {
                        $round: ['$avgWastagePercentage', 2],
                    },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalHopperInGunny: 0,
                totalHopperInQintal: 0,
                totalRiceQuantity: 0,
                totalKhandaQuantity: 0,
                totalKodhaQuantity: 0,
                totalBhusaTon: 0,
                totalNakkhiQuantity: 0,
                avgRicePercentage: 0,
                avgKhandaPercentage: 0,
                avgKodhaPercentage: 0,
                avgBhusaPercentage: 0,
                avgNakkhiPercentage: 0,
                avgWastagePercentage: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get milling paddy summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a milling paddy entry
 * @param {string} millId - Mill ID
 * @param {string} id - Milling paddy ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated milling paddy entry
 */
export const updateMillingPaddyEntry = async (millId, id, data, userId) => {
    try {
        const updateData = { ...data, updatedBy: userId }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const millingPaddy = await MillingPaddy.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!millingPaddy) {
            const error = new Error('Milling paddy entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Milling paddy entry updated', {
            id,
            millId,
            userId,
        })

        return millingPaddy
    } catch (error) {
        logger.error('Failed to update milling paddy entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a milling paddy entry
 * @param {string} millId - Mill ID
 * @param {string} id - Milling paddy ID
 * @returns {Promise<object>} Deleted milling paddy entry
 */
export const deleteMillingPaddyEntry = async (millId, id) => {
    try {
        const millingPaddy = await MillingPaddy.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!millingPaddy) {
            const error = new Error('Milling paddy entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Milling paddy entry deleted', {
            id,
            millId,
        })

        return millingPaddy
    } catch (error) {
        logger.error('Failed to delete milling paddy entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete milling paddy entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of milling paddy IDs
 * @returns {Promise<object>} Delete result
 */
export const bulkDeleteMillingPaddyEntries = async (millId, ids) => {
    try {
        const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id))

        const result = await MillingPaddy.deleteMany({
            _id: { $in: objectIds },
            millId: new mongoose.Types.ObjectId(millId),
        })

        logger.info('Milling paddy entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return {
            deletedCount: result.deletedCount,
        }
    } catch (error) {
        logger.error('Failed to bulk delete milling paddy entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
