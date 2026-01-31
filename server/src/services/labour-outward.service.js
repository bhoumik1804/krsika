import mongoose from 'mongoose'
import { LabourOutward } from '../models/labour-outward.model.js'
import logger from '../utils/logger.js'

/**
 * Labour Outward Service
 * Business logic for labour outward operations
 */

/**
 * Create a new labour outward entry
 */
export const createLabourOutwardEntry = async (millId, data, userId) => {
    try {
        const labourOutward = new LabourOutward({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await labourOutward.save()

        logger.info('Labour outward entry created', {
            id: labourOutward._id,
            millId,
            userId,
        })

        return labourOutward
    } catch (error) {
        logger.error('Failed to create labour outward entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour outward entry by ID
 */
export const getLabourOutwardById = async (millId, id) => {
    try {
        const labourOutward = await LabourOutward.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourOutward) {
            const error = new Error('Labour outward entry not found')
            error.statusCode = 404
            throw error
        }

        return labourOutward
    } catch (error) {
        logger.error('Failed to get labour outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour outward list with pagination and filters
 */
export const getLabourOutwardList = async (millId, options = {}) => {
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
                { outwardType: { $regex: search, $options: 'i' } },
                { truckNumber: { $regex: search, $options: 'i' } },
                { labourGroupName: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = LabourOutward.aggregate([
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

        const result = await LabourOutward.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get labour outward list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour outward summary statistics
 */
export const getLabourOutwardSummary = async (millId, options = {}) => {
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

        const [summary] = await LabourOutward.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalGunny: { $sum: { $ifNull: ['$totalGunny', 0] } },
                    totalLoadingCost: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$totalGunny', 0] },
                                { $ifNull: ['$loadingRate', 0] },
                            ],
                        },
                    },
                    totalDhulaiCost: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$totalGunny', 0] },
                                { $ifNull: ['$dhulaiRate', 0] },
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
                    totalLoadingCost: { $round: ['$totalLoadingCost', 2] },
                    totalDhulaiCost: { $round: ['$totalDhulaiCost', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalGunny: 0,
                totalLoadingCost: 0,
                totalDhulaiCost: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get labour outward summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a labour outward entry
 */
export const updateLabourOutwardEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const labourOutward = await LabourOutward.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourOutward) {
            const error = new Error('Labour outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour outward entry updated', {
            id,
            millId,
            userId,
        })

        return labourOutward
    } catch (error) {
        logger.error('Failed to update labour outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a labour outward entry
 */
export const deleteLabourOutwardEntry = async (millId, id) => {
    try {
        const labourOutward = await LabourOutward.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!labourOutward) {
            const error = new Error('Labour outward entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour outward entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete labour outward entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete labour outward entries
 */
export const bulkDeleteLabourOutwardEntries = async (millId, ids) => {
    try {
        const result = await LabourOutward.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Labour outward entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete labour outward entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
