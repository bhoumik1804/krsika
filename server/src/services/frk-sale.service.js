import mongoose from 'mongoose'
import { FrkSale } from '../models/frk-sale.model.js'
import logger from '../utils/logger.js'

/**
 * FRK Sale Service
 * Business logic for FRK sale operations
 */

/**
 * Create a new FRK sale entry
 */
export const createFrkSaleEntry = async (millId, data, userId) => {
    try {
        const frkSale = new FrkSale({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await frkSale.save()

        logger.info('FRK sale entry created', {
            id: frkSale._id,
            millId,
            userId,
        })

        return frkSale
    } catch (error) {
        logger.error('Failed to create FRK sale entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK sale entry by ID
 */
export const getFrkSaleById = async (millId, id) => {
    try {
        const frkSale = await FrkSale.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!frkSale) {
            const error = new Error('FRK sale entry not found')
            error.statusCode = 404
            throw error
        }

        return frkSale
    } catch (error) {
        logger.error('Failed to get FRK sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK sale list with pagination and filters
 */
export const getFrkSaleList = async (millId, options = {}) => {
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

        const aggregate = FrkSale.aggregate([
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

        const result = await FrkSale.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get FRK sale list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get FRK sale summary statistics
 */
export const getFrkSaleSummary = async (millId, options = {}) => {
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

        const [summary] = await FrkSale.aggregate([
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
        logger.error('Failed to get FRK sale summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a FRK sale entry
 */
export const updateFrkSaleEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const frkSale = await FrkSale.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!frkSale) {
            const error = new Error('FRK sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('FRK sale entry updated', {
            id,
            millId,
            userId,
        })

        return frkSale
    } catch (error) {
        logger.error('Failed to update FRK sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a FRK sale entry
 */
export const deleteFrkSaleEntry = async (millId, id) => {
    try {
        const frkSale = await FrkSale.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!frkSale) {
            const error = new Error('FRK sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('FRK sale entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete FRK sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete FRK sale entries
 */
export const bulkDeleteFrkSaleEntries = async (millId, ids) => {
    try {
        const result = await FrkSale.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('FRK sale entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete FRK sale entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
