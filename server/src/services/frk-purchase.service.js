import mongoose from 'mongoose'
import { FrkPurchase } from '../models/frk-purchase.model.js'
import logger from '../utils/logger.js'

/**
 * FRK Purchase Service
 * Business logic for FRK purchase operations
 */

/**
 * Create a new FRK purchase entry
 */
export const createFrkPurchaseEntry = async (millId, data, userId) => {
    try {
        const frkPurchase = new FrkPurchase({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await frkPurchase.save()

        logger.info('FRK purchase entry created', {
            id: frkPurchase._id,
            millId,
            userId,
        })

        return frkPurchase
    } catch (error) {
        logger.error('Failed to create FRK purchase entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK purchase entry by ID
 */
export const getFrkPurchaseById = async (millId, id) => {
    try {
        const frkPurchase = await FrkPurchase.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!frkPurchase) {
            const error = new Error('FRK purchase entry not found')
            error.statusCode = 404
            throw error
        }

        return frkPurchase
    } catch (error) {
        logger.error('Failed to get FRK purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK purchase list with pagination and filters
 */
export const getFrkPurchaseList = async (millId, options = {}) => {
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
            matchStage.$or = [{ partyName: { $regex: search, $options: 'i' } }]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = FrkPurchase.aggregate([
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

        const result = await FrkPurchase.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get FRK purchase list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK purchase summary statistics
 */
export const getFrkPurchaseSummary = async (millId, options = {}) => {
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

        const [summary] = await FrkPurchase.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalWeight: { $sum: { $ifNull: ['$totalWeight', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalWeight: { $round: ['$totalWeight', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalWeight: 0,
                totalAmount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get FRK purchase summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a FRK purchase entry
 */
export const updateFrkPurchaseEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const frkPurchase = await FrkPurchase.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!frkPurchase) {
            const error = new Error('FRK purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('FRK purchase entry updated', {
            id,
            millId,
            userId,
        })

        return frkPurchase
    } catch (error) {
        logger.error('Failed to update FRK purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a FRK purchase entry
 */
export const deleteFrkPurchaseEntry = async (millId, id) => {
    try {
        const frkPurchase = await FrkPurchase.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!frkPurchase) {
            const error = new Error('FRK purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('FRK purchase entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete FRK purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete FRK purchase entries
 */
export const bulkDeleteFrkPurchaseEntries = async (millId, ids) => {
    try {
        const result = await FrkPurchase.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('FRK purchase entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete FRK purchase entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
