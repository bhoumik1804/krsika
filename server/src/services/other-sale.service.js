import mongoose from 'mongoose'
import { OtherSale } from '../models/other-sale.model.js'
import logger from '../utils/logger.js'

/**
 * Other Sale Service
 * Business logic for other sale operations
 */

/**
 * Create a new other sale entry
 */
export const createOtherSaleEntry = async (millId, data, userId) => {
    try {
        const otherSale = new OtherSale({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await otherSale.save()

        logger.info('Other sale entry created', {
            id: otherSale._id,
            millId,
            userId,
        })

        return otherSale
    } catch (error) {
        logger.error('Failed to create other sale entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other sale entry by ID
 */
export const getOtherSaleById = async (millId, id) => {
    try {
        const otherSale = await OtherSale.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!otherSale) {
            const error = new Error('Other sale entry not found')
            error.statusCode = 404
            throw error
        }

        return otherSale
    } catch (error) {
        logger.error('Failed to get other sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other sale list with pagination and filters
 */
export const getOtherSaleList = async (millId, options = {}) => {
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

        const aggregate = OtherSale.aggregate([
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

        const result = await OtherSale.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get other sale list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get other sale summary statistics
 */
export const getOtherSaleSummary = async (millId, options = {}) => {
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

        const [summary] = await OtherSale.aggregate([
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
        logger.error('Failed to get other sale summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update an other sale entry
 */
export const updateOtherSaleEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const otherSale = await OtherSale.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!otherSale) {
            const error = new Error('Other sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Other sale entry updated', {
            id,
            millId,
            userId,
        })

        return otherSale
    } catch (error) {
        logger.error('Failed to update other sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete an other sale entry
 */
export const deleteOtherSaleEntry = async (millId, id) => {
    try {
        const otherSale = await OtherSale.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!otherSale) {
            const error = new Error('Other sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Other sale entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete other sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete other sale entries
 */
export const bulkDeleteOtherSaleEntries = async (millId, ids) => {
    try {
        const result = await OtherSale.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Other sale entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete other sale entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
