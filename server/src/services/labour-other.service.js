import mongoose from 'mongoose'
import { LabourOther } from '../models/labour-other.model.js'
import logger from '../utils/logger.js'

/**
 * Labour Other Service
 * Business logic for labour other operations
 */

/**
 * Create a new labour other entry
 */
export const createLabourOtherEntry = async (millId, data, userId) => {
    try {
        const labourOther = new LabourOther({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await labourOther.save()

        logger.info('Labour other entry created', {
            id: labourOther._id,
            millId,
            userId,
        })

        return labourOther
    } catch (error) {
        logger.error('Failed to create labour other entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour other entry by ID
 */
export const getLabourOtherById = async (millId, id) => {
    try {
        const labourOther = await LabourOther.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourOther) {
            const error = new Error('Labour other entry not found')
            error.statusCode = 404
            throw error
        }

        return labourOther
    } catch (error) {
        logger.error('Failed to get labour other entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour other list with pagination and filters
 */
export const getLabourOtherList = async (millId, options = {}) => {
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
                { labourType: { $regex: search, $options: 'i' } },
                { labourGroupName: { $regex: search, $options: 'i' } },
                { workDetail: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = LabourOther.aggregate([
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

        const result = await LabourOther.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get labour other list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour other summary statistics
 */
export const getLabourOtherSummary = async (millId, options = {}) => {
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

        const [summary] = await LabourOther.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalGunny: { $sum: { $ifNull: ['$numberOfGunny', 0] } },
                    totalCost: { $sum: { $ifNull: ['$totalPrice', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalGunny: { $round: ['$totalGunny', 2] },
                    totalCost: { $round: ['$totalCost', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalGunny: 0,
                totalCost: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get labour other summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a labour other entry
 */
export const updateLabourOtherEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const labourOther = await LabourOther.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourOther) {
            const error = new Error('Labour other entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour other entry updated', {
            id,
            millId,
            userId,
        })

        return labourOther
    } catch (error) {
        logger.error('Failed to update labour other entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a labour other entry
 */
export const deleteLabourOtherEntry = async (millId, id) => {
    try {
        const labourOther = await LabourOther.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!labourOther) {
            const error = new Error('Labour other entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour other entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete labour other entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete labour other entries
 */
export const bulkDeleteLabourOtherEntries = async (millId, ids) => {
    try {
        const result = await LabourOther.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Labour other entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete labour other entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
