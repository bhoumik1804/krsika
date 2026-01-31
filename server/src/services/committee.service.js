import mongoose from 'mongoose'
import { Committee } from '../models/committee.model.js'
import logger from '../utils/logger.js'

/**
 * Committee Service
 * Business logic for committee operations
 */

/**
 * Create a new committee
 */
export const createCommitteeEntry = async (millId, data, userId) => {
    try {
        const committee = new Committee({
            ...data,
            millId,
            createdBy: userId,
        })

        await committee.save()

        logger.info('Committee created', {
            id: committee._id,
            millId,
            userId,
        })

        return committee
    } catch (error) {
        logger.error('Failed to create committee', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get committee by ID
 */
export const getCommitteeById = async (millId, id) => {
    try {
        const committee = await Committee.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!committee) {
            const error = new Error('Committee not found')
            error.statusCode = 404
            throw error
        }

        return committee
    } catch (error) {
        logger.error('Failed to get committee', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get committee list with pagination and filters
 */
export const getCommitteeList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'committeeName',
            sortOrder = 'asc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            matchStage.$or = [
                { committeeName: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = Committee.aggregate([
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

        const result = await Committee.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get committee list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get committee summary statistics
 */
export const getCommitteeSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await Committee.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalCommittees: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalCommittees: 1,
                },
            },
        ])

        return (
            summary || {
                totalCommittees: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get committee summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a committee
 */
export const updateCommitteeEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const committee = await Committee.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!committee) {
            const error = new Error('Committee not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Committee updated', {
            id,
            millId,
            userId,
        })

        return committee
    } catch (error) {
        logger.error('Failed to update committee', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a committee
 */
export const deleteCommitteeEntry = async (millId, id) => {
    try {
        const committee = await Committee.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!committee) {
            const error = new Error('Committee not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Committee deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete committee', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete committees
 */
export const bulkDeleteCommitteeEntries = async (millId, ids) => {
    try {
        const result = await Committee.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Committees bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete committees', {
            millId,
            error: error.message,
        })
        throw error
    }
}
