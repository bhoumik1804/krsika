import mongoose from 'mongoose'
import { LabourGroup } from '../models/labour-group.model.js'
import logger from '../utils/logger.js'

/**
 * Labour Group Service
 * Business logic for labour group operations
 */

/**
 * Create a new labour group
 */
export const createLabourGroupEntry = async (millId, data, userId) => {
    try {
        const labourGroup = new LabourGroup({
            ...data,
            millId,
            createdBy: userId,
        })

        await labourGroup.save()

        logger.info('Labour group created', {
            id: labourGroup._id,
            millId,
            userId,
        })

        return labourGroup
    } catch (error) {
        logger.error('Failed to create labour group', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour group by ID
 */
export const getLabourGroupById = async (millId, id) => {
    try {
        const labourGroup = await LabourGroup.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourGroup) {
            const error = new Error('Labour group not found')
            error.statusCode = 404
            throw error
        }

        return labourGroup
    } catch (error) {
        logger.error('Failed to get labour group', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour group list with pagination and filters
 */
export const getLabourGroupList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'groupName',
            sortOrder = 'asc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            matchStage.$or = [
                { groupName: { $regex: search, $options: 'i' } },
                { leaderName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { workType: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = LabourGroup.aggregate([
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

        const result = await LabourGroup.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get labour group list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get labour group summary statistics
 */
export const getLabourGroupSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await LabourGroup.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalGroups: { $sum: 1 },
                    totalMembers: { $sum: { $ifNull: ['$memberCount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalGroups: 1,
                    totalMembers: 1,
                },
            },
        ])

        return (
            summary || {
                totalGroups: 0,
                totalMembers: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get labour group summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a labour group
 */
export const updateLabourGroupEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const labourGroup = await LabourGroup.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!labourGroup) {
            const error = new Error('Labour group not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour group updated', {
            id,
            millId,
            userId,
        })

        return labourGroup
    } catch (error) {
        logger.error('Failed to update labour group', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a labour group
 */
export const deleteLabourGroupEntry = async (millId, id) => {
    try {
        const labourGroup = await LabourGroup.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!labourGroup) {
            const error = new Error('Labour group not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Labour group deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete labour group', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete labour groups
 */
export const bulkDeleteLabourGroupEntries = async (millId, ids) => {
    try {
        const result = await LabourGroup.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Labour groups bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete labour groups', {
            millId,
            error: error.message,
        })
        throw error
    }
}
