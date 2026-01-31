import mongoose from 'mongoose'
import { OtherInward } from '../models/other-inward.model.js'
import logger from '../utils/logger.js'

/**
 * Other Inward Service
 * Business logic for other inward operations
 */

/**
 * Create a new other inward entry
 * @param {string} millId - Mill ID
 * @param {object} data - Other inward data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created other inward entry
 */
export const createOtherInwardEntry = async (millId, data, userId) => {
    try {
        const otherInward = new OtherInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await otherInward.save()

        logger.info('Other inward entry created', {
            id: otherInward._id,
            millId,
            userId,
        })

        return otherInward
    } catch (error) {
        logger.error('Failed to create other inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other inward entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Other inward ID
 * @returns {Promise<object>} Other inward entry
 */
export const getOtherInwardById = async (millId, id) => {
    try {
        const otherInward = await OtherInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!otherInward) {
            const error = new Error('Other inward entry not found')
            error.statusCode = 404
            throw error
        }

        return otherInward
    } catch (error) {
        logger.error('Failed to get other inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other inward list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated other inward list
 */
export const getOtherInwardList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            partyName,
            itemName,
            unit,
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

        if (itemName) {
            matchStage.itemName = { $regex: itemName, $options: 'i' }
        }

        if (unit) {
            matchStage.unit = { $regex: unit, $options: 'i' }
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
                { itemName: { $regex: search, $options: 'i' } },
                { unit: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = OtherInward.aggregate([
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
        const result = await OtherInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get other inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other inward summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getOtherInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await OtherInward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalQuantity: { $sum: { $ifNull: ['$quantity', 0] } },
                    totalRate: { $sum: { $ifNull: ['$rate', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalQuantity: { $round: ['$totalQuantity', 2] },
                    totalRate: { $round: ['$totalRate', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalQuantity: 0,
                totalRate: 0,
                totalAmount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get other inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update an other inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Other inward ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated other inward entry
 */
export const updateOtherInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const otherInward = await OtherInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!otherInward) {
            const error = new Error('Other inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Other inward entry updated', {
            id,
            millId,
            userId,
        })

        return otherInward
    } catch (error) {
        logger.error('Failed to update other inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete an other inward entry
 * @param {string} millId - Mill ID
 * @param {string} id - Other inward ID
 * @returns {Promise<void>}
 */
export const deleteOtherInwardEntry = async (millId, id) => {
    try {
        const otherInward = await OtherInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!otherInward) {
            const error = new Error('Other inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Other inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete other inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete other inward entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of other inward IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteOtherInwardEntries = async (millId, ids) => {
    try {
        const result = await OtherInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Other inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete other inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
