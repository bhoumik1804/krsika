import mongoose from 'mongoose'
import { GunnySale } from '../models/gunny-sale.model.js'
import logger from '../utils/logger.js'

/**
 * Gunny Sale Service
 * Business logic for gunny sale operations
 */

/**
 * Create a new gunny sale entry
 */
export const createGunnySaleEntry = async (millId, data, userId) => {
    try {
        const gunnySale = new GunnySale({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await gunnySale.save()

        logger.info('Gunny sale entry created', {
            id: gunnySale._id,
            millId,
            userId,
        })

        return gunnySale
    } catch (error) {
        logger.error('Failed to create gunny sale entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny sale entry by ID
 */
export const getGunnySaleById = async (millId, id) => {
    try {
        const gunnySale = await GunnySale.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!gunnySale) {
            const error = new Error('Gunny sale entry not found')
            error.statusCode = 404
            throw error
        }

        return gunnySale
    } catch (error) {
        logger.error('Failed to get gunny sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny sale list with pagination and filters
 */
export const getGunnySaleList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

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

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = GunnySale.aggregate([
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

        const result = await GunnySale.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get gunny sale list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny sale summary statistics
 */
export const getGunnySaleSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate } = options

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

        const [summary] = await GunnySale.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalGunny: { $sum: { $ifNull: ['$totalGunny', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalGunny: { $round: ['$totalGunny', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalGunny: 0,
                totalAmount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get gunny sale summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a gunny sale entry
 */
export const updateGunnySaleEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const gunnySale = await GunnySale.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!gunnySale) {
            const error = new Error('Gunny sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Gunny sale entry updated', {
            id,
            millId,
            userId,
        })

        return gunnySale
    } catch (error) {
        logger.error('Failed to update gunny sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a gunny sale entry
 */
export const deleteGunnySaleEntry = async (millId, id) => {
    try {
        const gunnySale = await GunnySale.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!gunnySale) {
            const error = new Error('Gunny sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Gunny sale entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete gunny sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete gunny sale entries
 */
export const bulkDeleteGunnySaleEntries = async (millId, ids) => {
    try {
        const result = await GunnySale.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Gunny sale entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete gunny sale entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
