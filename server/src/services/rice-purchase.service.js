import mongoose from 'mongoose'
import { RicePurchase } from '../models/rice-purchase.model.js'
import logger from '../utils/logger.js'

/**
 * Rice Purchase Service
 * Business logic for rice purchase operations
 */

/**
 * Create a new rice purchase entry
 */
export const createRicePurchaseEntry = async (millId, data, userId) => {
    try {
        const ricePurchase = new RicePurchase({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await ricePurchase.save()

        logger.info('Rice purchase entry created', {
            id: ricePurchase._id,
            millId,
            userId,
        })

        return ricePurchase
    } catch (error) {
        logger.error('Failed to create rice purchase entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice purchase entry by ID
 */
export const getRicePurchaseById = async (millId, id) => {
    try {
        const ricePurchase = await RicePurchase.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!ricePurchase) {
            const error = new Error('Rice purchase entry not found')
            error.statusCode = 404
            throw error
        }

        return ricePurchase
    } catch (error) {
        logger.error('Failed to get rice purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice purchase list with pagination and filters
 */
export const getRicePurchaseList = async (millId, options = {}) => {
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
                { riceType: { $regex: search, $options: 'i' } },
                { brokerName: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = RicePurchase.aggregate([
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

        const result = await RicePurchase.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get rice purchase list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice purchase summary statistics
 */
export const getRicePurchaseSummary = async (millId, options = {}) => {
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

        const [summary] = await RicePurchase.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalNetWeight: { $sum: { $ifNull: ['$netWeight', 0] } },
                    totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
                    totalBrokerage: { $sum: { $ifNull: ['$brokerage', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalNetWeight: { $round: ['$totalNetWeight', 2] },
                    totalAmount: { $round: ['$totalAmount', 2] },
                    totalBrokerage: { $round: ['$totalBrokerage', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalNetWeight: 0,
                totalAmount: 0,
                totalBrokerage: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get rice purchase summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a rice purchase entry
 */
export const updateRicePurchaseEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const ricePurchase = await RicePurchase.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!ricePurchase) {
            const error = new Error('Rice purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Rice purchase entry updated', {
            id,
            millId,
            userId,
        })

        return ricePurchase
    } catch (error) {
        logger.error('Failed to update rice purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a rice purchase entry
 */
export const deleteRicePurchaseEntry = async (millId, id) => {
    try {
        const ricePurchase = await RicePurchase.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!ricePurchase) {
            const error = new Error('Rice purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Rice purchase entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete rice purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete rice purchase entries
 */
export const bulkDeleteRicePurchaseEntries = async (millId, ids) => {
    try {
        const result = await RicePurchase.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Rice purchase entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete rice purchase entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
