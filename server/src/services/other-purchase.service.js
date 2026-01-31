import mongoose from 'mongoose'
import { OtherPurchase } from '../models/other-purchase.model.js'
import logger from '../utils/logger.js'

/**
 * Other Purchase Service
 * Business logic for other purchase operations
 */

/**
 * Create a new other purchase entry
 */
export const createOtherPurchaseEntry = async (millId, data, userId) => {
    try {
        const otherPurchase = new OtherPurchase({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await otherPurchase.save()

        logger.info('Other purchase entry created', {
            id: otherPurchase._id,
            millId,
            userId,
        })

        return otherPurchase
    } catch (error) {
        logger.error('Failed to create other purchase entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other purchase entry by ID
 */
export const getOtherPurchaseById = async (millId, id) => {
    try {
        const otherPurchase = await OtherPurchase.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!otherPurchase) {
            const error = new Error('Other purchase entry not found')
            error.statusCode = 404
            throw error
        }

        return otherPurchase
    } catch (error) {
        logger.error('Failed to get other purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other purchase list with pagination and filters
 */
export const getOtherPurchaseList = async (millId, options = {}) => {
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
                { itemName: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = OtherPurchase.aggregate([
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

        const result = await OtherPurchase.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get other purchase list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other purchase summary statistics
 */
export const getOtherPurchaseSummary = async (millId, options = {}) => {
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

        const [summary] = await OtherPurchase.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalQuantity: { $sum: { $ifNull: ['$quantity', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalQuantity: { $round: ['$totalQuantity', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalQuantity: 0,
                totalAmount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get other purchase summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a other purchase entry
 */
export const updateOtherPurchaseEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const otherPurchase = await OtherPurchase.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!otherPurchase) {
            const error = new Error('Other purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Other purchase entry updated', {
            id,
            millId,
            userId,
        })

        return otherPurchase
    } catch (error) {
        logger.error('Failed to update other purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a other purchase entry
 */
export const deleteOtherPurchaseEntry = async (millId, id) => {
    try {
        const otherPurchase = await OtherPurchase.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!otherPurchase) {
            const error = new Error('Other purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Other purchase entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete other purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete other purchase entries
 */
export const bulkDeleteOtherPurchaseEntries = async (millId, ids) => {
    try {
        const result = await OtherPurchase.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Other purchase entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete other purchase entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
