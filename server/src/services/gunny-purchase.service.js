import mongoose from 'mongoose'
import { GunnyPurchase } from '../models/gunny-purchase.model.js'
import logger from '../utils/logger.js'

/**
 * Gunny Purchase Service
 * Business logic for gunny purchase operations
 */

/**
 * Create a new gunny purchase entry
 */
export const createGunnyPurchaseEntry = async (millId, data, userId) => {
    try {
        const gunnyPurchase = new GunnyPurchase({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await gunnyPurchase.save()

        logger.info('Gunny purchase entry created', {
            id: gunnyPurchase._id,
            millId,
            userId,
        })

        return gunnyPurchase
    } catch (error) {
        logger.error('Failed to create gunny purchase entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny purchase entry by ID
 */
export const getGunnyPurchaseById = async (millId, id) => {
    try {
        const gunnyPurchase = await GunnyPurchase.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!gunnyPurchase) {
            const error = new Error('Gunny purchase entry not found')
            error.statusCode = 404
            throw error
        }

        return gunnyPurchase
    } catch (error) {
        logger.error('Failed to get gunny purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny purchase list with pagination and filters
 */
export const getGunnyPurchaseList = async (millId, options = {}) => {
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

        const aggregate = GunnyPurchase.aggregate([
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

        const result = await GunnyPurchase.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get gunny purchase list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get gunny purchase summary statistics
 */
export const getGunnyPurchaseSummary = async (millId, options = {}) => {
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

        const [summary] = await GunnyPurchase.aggregate([
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
        logger.error('Failed to get gunny purchase summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a gunny purchase entry
 */
export const updateGunnyPurchaseEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const gunnyPurchase = await GunnyPurchase.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!gunnyPurchase) {
            const error = new Error('Gunny purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Gunny purchase entry updated', {
            id,
            millId,
            userId,
        })

        return gunnyPurchase
    } catch (error) {
        logger.error('Failed to update gunny purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a gunny purchase entry
 */
export const deleteGunnyPurchaseEntry = async (millId, id) => {
    try {
        const gunnyPurchase = await GunnyPurchase.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!gunnyPurchase) {
            const error = new Error('Gunny purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Gunny purchase entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete gunny purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete gunny purchase entries
 */
export const bulkDeleteGunnyPurchaseEntries = async (millId, ids) => {
    try {
        const result = await GunnyPurchase.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Gunny purchase entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete gunny purchase entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
