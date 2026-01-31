import mongoose from 'mongoose'
import { LabourMilling } from '../models/labour-milling.model.js'
import logger from '../utils/logger.js'

/**
 * Labour Milling Service
 * Business logic for labour milling operations
 */

/**
 * Create a new labour milling entry
 */
export const createLabourMillingEntry = async (millId, data, userId) => {
    try {
        const labourMilling = new LabourMilling({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await labourMilling.save()

        logger.info('Labour milling entry created', {
            id: labourMilling._id,
            millId,
            userId,
        })

        return labourMilling
    } catch (error) {
        logger.error('Failed to create labour milling entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour milling entry by ID
 */
export const getLabourMillingById = async (millId, id) => {
    try {
        const labourMilling = await LabourMilling.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourMilling) {
            const error = new Error('Labour milling entry not found')
            error.statusCode = 404
            throw error
        }

        return labourMilling
    } catch (error) {
        logger.error('Failed to get labour milling entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour milling list with pagination and filters
 */
export const getLabourMillingList = async (millId, options = {}) => {
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
                { labourGroupName: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = LabourMilling.aggregate([
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

        const result = await LabourMilling.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get labour milling list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour milling summary statistics
 */
export const getLabourMillingSummary = async (millId, options = {}) => {
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

        const [summary] = await LabourMilling.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalHopperGunny: {
                        $sum: { $ifNull: ['$hopperInGunny', 0] },
                    },
                    totalHopperCost: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$hopperInGunny', 0] },
                                { $ifNull: ['$hopperRate', 0] },
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalHopperGunny: { $round: ['$totalHopperGunny', 2] },
                    totalHopperCost: { $round: ['$totalHopperCost', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalHopperGunny: 0,
                totalHopperCost: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get labour milling summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a labour milling entry
 */
export const updateLabourMillingEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const labourMilling = await LabourMilling.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourMilling) {
            const error = new Error('Labour milling entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour milling entry updated', {
            id,
            millId,
            userId,
        })

        return labourMilling
    } catch (error) {
        logger.error('Failed to update labour milling entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a labour milling entry
 */
export const deleteLabourMillingEntry = async (millId, id) => {
    try {
        const labourMilling = await LabourMilling.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!labourMilling) {
            const error = new Error('Labour milling entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour milling entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete labour milling entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete labour milling entries
 */
export const bulkDeleteLabourMillingEntries = async (millId, ids) => {
    try {
        const result = await LabourMilling.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Labour milling entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete labour milling entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
