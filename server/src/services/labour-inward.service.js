import mongoose from 'mongoose'
import { LabourInward } from '../models/labour-inward.model.js'
import logger from '../utils/logger.js'

/**
 * Labour Inward Service
 * Business logic for labour inward operations
 */

/**
 * Create a new labour inward entry
 */
export const createLabourInwardEntry = async (millId, data, userId) => {
    try {
        const labourInward = new LabourInward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await labourInward.save()

        logger.info('Labour inward entry created', {
            id: labourInward._id,
            millId,
            userId,
        })

        return labourInward
    } catch (error) {
        logger.error('Failed to create labour inward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour inward entry by ID
 */
export const getLabourInwardById = async (millId, id) => {
    try {
        const labourInward = await LabourInward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourInward) {
            const error = new Error('Labour inward entry not found')
            error.statusCode = 404
            throw error
        }

        return labourInward
    } catch (error) {
        logger.error('Failed to get labour inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour inward list with pagination and filters
 */
export const getLabourInwardList = async (millId, options = {}) => {
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
                { inwardType: { $regex: search, $options: 'i' } },
                { truckNumber: { $regex: search, $options: 'i' } },
                { labourGroupName: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = LabourInward.aggregate([
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

        const result = await LabourInward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get labour inward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour inward summary statistics
 */
export const getLabourInwardSummary = async (millId, options = {}) => {
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

        const [summary] = await LabourInward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalGunny: { $sum: { $ifNull: ['$totalGunny', 0] } },
                    totalUnloadingCost: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$totalGunny', 0] },
                                { $ifNull: ['$unloadingRate', 0] },
                            ],
                        },
                    },
                    totalStackingCost: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$totalGunny', 0] },
                                { $ifNull: ['$stackingRate', 0] },
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalGunny: { $round: ['$totalGunny', 2] },
                    totalUnloadingCost: { $round: ['$totalUnloadingCost', 2] },
                    totalStackingCost: { $round: ['$totalStackingCost', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalGunny: 0,
                totalUnloadingCost: 0,
                totalStackingCost: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get labour inward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a labour inward entry
 */
export const updateLabourInwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const labourInward = await LabourInward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourInward) {
            const error = new Error('Labour inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour inward entry updated', {
            id,
            millId,
            userId,
        })

        return labourInward
    } catch (error) {
        logger.error('Failed to update labour inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a labour inward entry
 */
export const deleteLabourInwardEntry = async (millId, id) => {
    try {
        const labourInward = await LabourInward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!labourInward) {
            const error = new Error('Labour inward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour inward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete labour inward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete labour inward entries
 */
export const bulkDeleteLabourInwardEntries = async (millId, ids) => {
    try {
        const result = await LabourInward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Labour inward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete labour inward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
