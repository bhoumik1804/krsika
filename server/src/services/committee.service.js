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
 * Bulk create committees
 */
export const bulkCreateCommittees = async (millId, dataArray, userId) => {
    try {
        const committees = dataArray.map((data) => ({
            ...data,
            millId,
            createdBy: userId,
        }))

        const result = await Committee.insertMany(committees, { ordered: false })

        logger.info('Bulk committees created', {
            count: result.length,
            millId,
            userId,
        })

        return {
            created: result.length,
            committees: result,
        }
    } catch (error) {
        logger.error('Failed to bulk create committees', {
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

        const query = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            query.$or = [
                { committeeName: { $regex: search, $options: 'i' } },
                { committeeType: { $regex: search, $options: 'i' } },
            ]
        }

        const sortObj = {}
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1

        const skip = (page - 1) * limit

        const data = await Committee.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'createdBy',
                select: 'fullName email',
                as: 'createdByUser',
            })
            .lean()

        const total = await Committee.countDocuments(query)
        const totalPages = Math.ceil(total / limit)

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
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
