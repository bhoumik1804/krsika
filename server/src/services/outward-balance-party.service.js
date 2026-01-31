import mongoose from 'mongoose'
import { OutwardBalanceParty } from '../models/outward-balance-party.model.js'
import logger from '../utils/logger.js'

/**
 * Outward Balance Party Service
 * Business logic for outward balance party operations
 */

/**
 * Create a new outward balance party entry
 */
export const createOutwardBalancePartyEntry = async (millId, data, userId) => {
    try {
        const outwardBalanceParty = new OutwardBalanceParty({
            ...data,
            millId,
            createdBy: userId,
        })

        await outwardBalanceParty.save()

        logger.info('Outward balance party entry created', {
            id: outwardBalanceParty._id,
            millId,
            userId,
        })

        return outwardBalanceParty
    } catch (error) {
        logger.error('Failed to create outward balance party entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get outward balance party entry by ID
 */
export const getOutwardBalancePartyById = async (millId, id) => {
    try {
        const outwardBalanceParty = await OutwardBalanceParty.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!outwardBalanceParty) {
            const error = new Error('Outward balance party entry not found')
            error.statusCode = 404
            throw error
        }

        return outwardBalanceParty
    } catch (error) {
        logger.error('Failed to get outward balance party entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get outward balance party list with pagination and filters
 */
export const getOutwardBalancePartyList = async (millId, options = {}) => {
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
            matchStage.$or = [{ partyName: { $regex: search, $options: 'i' } }]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = OutwardBalanceParty.aggregate([
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

        const result = await OutwardBalanceParty.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get outward balance party list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get outward balance party summary statistics
 */
export const getOutwardBalancePartySummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await OutwardBalanceParty.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalRice: { $sum: { $ifNull: ['$rice', 0] } },
                    totalGunny: { $sum: { $ifNull: ['$gunny', 0] } },
                    totalFrk: { $sum: { $ifNull: ['$frk', 0] } },
                    totalOther: { $sum: { $ifNull: ['$other', 0] } },
                    grandTotalBalance: {
                        $sum: { $ifNull: ['$totalBalance', 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalRice: { $round: ['$totalRice', 2] },
                    totalGunny: { $round: ['$totalGunny', 2] },
                    totalFrk: { $round: ['$totalFrk', 2] },
                    totalOther: { $round: ['$totalOther', 2] },
                    grandTotalBalance: { $round: ['$grandTotalBalance', 2] },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalRice: 0,
                totalGunny: 0,
                totalFrk: 0,
                totalOther: 0,
                grandTotalBalance: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get outward balance party summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update an outward balance party entry
 */
export const updateOutwardBalancePartyEntry = async (
    millId,
    id,
    data,
    userId
) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const outwardBalanceParty = await OutwardBalanceParty.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!outwardBalanceParty) {
            const error = new Error('Outward balance party entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Outward balance party entry updated', {
            id,
            millId,
            userId,
        })

        return outwardBalanceParty
    } catch (error) {
        logger.error('Failed to update outward balance party entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete an outward balance party entry
 */
export const deleteOutwardBalancePartyEntry = async (millId, id) => {
    try {
        const outwardBalanceParty = await OutwardBalanceParty.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!outwardBalanceParty) {
            const error = new Error('Outward balance party entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Outward balance party entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete outward balance party entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete outward balance party entries
 */
export const bulkDeleteOutwardBalancePartyEntries = async (millId, ids) => {
    try {
        const result = await OutwardBalanceParty.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Outward balance party entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete outward balance party entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
