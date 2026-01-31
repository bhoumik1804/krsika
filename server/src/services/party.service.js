import mongoose from 'mongoose'
import { Party } from '../models/party.model.js'
import logger from '../utils/logger.js'

/**
 * Party Service
 * Business logic for party operations
 */

/**
 * Create a new party
 */
export const createPartyEntry = async (millId, data, userId) => {
    try {
        const party = new Party({
            ...data,
            millId,
            createdBy: userId,
        })

        await party.save()

        logger.info('Party created', {
            id: party._id,
            millId,
            userId,
        })

        return party
    } catch (error) {
        logger.error('Failed to create party', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get party by ID
 */
export const getPartyById = async (millId, id) => {
    try {
        const party = await Party.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!party) {
            const error = new Error('Party not found')
            error.statusCode = 404
            throw error
        }

        return party
    } catch (error) {
        logger.error('Failed to get party', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get party list with pagination and filters
 */
export const getPartyList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'partyName',
            sortOrder = 'asc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            matchStage.$or = [
                { partyName: { $regex: search, $options: 'i' } },
                { gstn: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = Party.aggregate([
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

        const result = await Party.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get party list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get party summary statistics
 */
export const getPartySummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await Party.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalParties: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalParties: 1,
                },
            },
        ])

        return (
            summary || {
                totalParties: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get party summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a party
 */
export const updatePartyEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const party = await Party.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!party) {
            const error = new Error('Party not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Party updated', {
            id,
            millId,
            userId,
        })

        return party
    } catch (error) {
        logger.error('Failed to update party', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a party
 */
export const deletePartyEntry = async (millId, id) => {
    try {
        const party = await Party.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!party) {
            const error = new Error('Party not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Party deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete party', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete parties
 */
export const bulkDeletePartyEntries = async (millId, ids) => {
    try {
        const result = await Party.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Parties bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete parties', {
            millId,
            error: error.message,
        })
        throw error
    }
}
