import mongoose from 'mongoose'
import { BalanceLiftingParty } from '../models/balance-lifting-party.model.js'
import logger from '../utils/logger.js'

/**
 * Balance Lifting Party Service
 * Business logic for balance lifting party operations
 */

/**
 * Create a new balance lifting party entry
 */
export const createBalanceLiftingPartyEntry = async (millId, data, userId) => {
    try {
        const balanceLiftingParty = new BalanceLiftingParty({
            ...data,
            millId,
            createdBy: userId,
        })

        await balanceLiftingParty.save()

        logger.info('Balance lifting party entry created', {
            id: balanceLiftingParty._id,
            millId,
            userId,
        })

        return balanceLiftingParty
    } catch (error) {
        logger.error('Failed to create balance lifting party entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get balance lifting party entry by ID
 */
export const getBalanceLiftingPartyById = async (millId, id) => {
    try {
        const balanceLiftingParty = await BalanceLiftingParty.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!balanceLiftingParty) {
            const error = new Error('Balance lifting party entry not found')
            error.statusCode = 404
            throw error
        }

        return balanceLiftingParty
    } catch (error) {
        logger.error('Failed to get balance lifting party entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get balance lifting party list with pagination and filters
 */
export const getBalanceLiftingPartyList = async (millId, options = {}) => {
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

        const aggregate = BalanceLiftingParty.aggregate([
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

        const result = await BalanceLiftingParty.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get balance lifting party list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get balance lifting party summary statistics
 */
export const getBalanceLiftingPartySummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await BalanceLiftingParty.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalPaddy: { $sum: { $ifNull: ['$paddy', 0] } },
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
                    totalPaddy: { $round: ['$totalPaddy', 2] },
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
                totalPaddy: 0,
                totalRice: 0,
                totalGunny: 0,
                totalFrk: 0,
                totalOther: 0,
                grandTotalBalance: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get balance lifting party summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a balance lifting party entry
 */
export const updateBalanceLiftingPartyEntry = async (
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

        const balanceLiftingParty = await BalanceLiftingParty.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!balanceLiftingParty) {
            const error = new Error('Balance lifting party entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Balance lifting party entry updated', {
            id,
            millId,
            userId,
        })

        return balanceLiftingParty
    } catch (error) {
        logger.error('Failed to update balance lifting party entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a balance lifting party entry
 */
export const deleteBalanceLiftingPartyEntry = async (millId, id) => {
    try {
        const balanceLiftingParty = await BalanceLiftingParty.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!balanceLiftingParty) {
            const error = new Error('Balance lifting party entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Balance lifting party entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete balance lifting party entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete balance lifting party entries
 */
export const bulkDeleteBalanceLiftingPartyEntries = async (millId, ids) => {
    try {
        const result = await BalanceLiftingParty.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Balance lifting party entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete balance lifting party entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
