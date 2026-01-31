import mongoose from 'mongoose'
import { MillingRice } from '../models/milling-rice.model.js'
import logger from '../utils/logger.js'

/**
 * Milling Rice Service
 * Business logic for milling rice operations
 */

/**
 * Create a new milling rice entry
 */
export const createMillingRiceEntry = async (millId, data, userId) => {
    try {
        const millingRice = new MillingRice({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await millingRice.save()

        logger.info('Milling rice entry created', {
            id: millingRice._id,
            millId,
            userId,
        })

        return millingRice
    } catch (error) {
        logger.error('Failed to create milling rice entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get milling rice entry by ID
 */
export const getMillingRiceById = async (millId, id) => {
    try {
        const millingRice = await MillingRice.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!millingRice) {
            const error = new Error('Milling rice entry not found')
            error.statusCode = 404
            throw error
        }

        return millingRice
    } catch (error) {
        logger.error('Failed to get milling rice entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get milling rice list with pagination and filters
 */
export const getMillingRiceList = async (millId, options = {}) => {
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
                { riceLot: { $regex: search, $options: 'i' } },
                { riceType: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = MillingRice.aggregate([
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

        const result = await MillingRice.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get milling rice list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get milling rice summary statistics
 */
export const getMillingRiceSummary = async (millId, options = {}) => {
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

        const [summary] = await MillingRice.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalPaddy: { $sum: { $ifNull: ['$totalPaddy', 0] } },
                    totalRice: { $sum: { $ifNull: ['$totalRice', 0] } },
                    totalBrokenRice: { $sum: { $ifNull: ['$brokenRice', 0] } },
                    totalKhurai: { $sum: { $ifNull: ['$khurai', 0] } },
                    avgMillRecovery: {
                        $avg: { $ifNull: ['$millRecovery', 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalPaddy: { $round: ['$totalPaddy', 2] },
                    totalRice: { $round: ['$totalRice', 2] },
                    totalBrokenRice: { $round: ['$totalBrokenRice', 2] },
                    totalKhurai: { $round: ['$totalKhurai', 2] },
                    avgMillRecovery: { $round: ['$avgMillRecovery', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalPaddy: 0,
                totalRice: 0,
                totalBrokenRice: 0,
                totalKhurai: 0,
                avgMillRecovery: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get milling rice summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a milling rice entry
 */
export const updateMillingRiceEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const millingRice = await MillingRice.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!millingRice) {
            const error = new Error('Milling rice entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Milling rice entry updated', {
            id,
            millId,
            userId,
        })

        return millingRice
    } catch (error) {
        logger.error('Failed to update milling rice entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a milling rice entry
 */
export const deleteMillingRiceEntry = async (millId, id) => {
    try {
        const millingRice = await MillingRice.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!millingRice) {
            const error = new Error('Milling rice entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Milling rice entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete milling rice entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete milling rice entries
 */
export const bulkDeleteMillingRiceEntries = async (millId, ids) => {
    try {
        const result = await MillingRice.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Milling rice entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete milling rice entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
