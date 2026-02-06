import mongoose from 'mongoose'
import { BalanceLiftingParty } from '../models/balance-lifting-party.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createBalanceLiftingPartyEntry = async (millId, data, userId) => {
    const entry = new BalanceLiftingParty({
        ...data,
        millId,
        createdBy: userId,
    })
    await entry.save()
    logger.info('Balance lifting party entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getBalanceLiftingPartyById = async (millId, id) => {
    const entry = await BalanceLiftingParty.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Balance lifting party entry not found')
    return entry
}

export const getBalanceLiftingPartyList = async (millId, options = {}) => {
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

    const aggregate = BalanceLiftingParty.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
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
}

export const getBalanceLiftingPartySummary = async (millId) => {
    const [summary] = await BalanceLiftingParty.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalBalance: { $sum: '$balance' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalBalance: { $round: ['$totalBalance', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalBalance: 0 }
}

export const updateBalanceLiftingPartyEntry = async (
    millId,
    id,
    data,
    userId
) => {
    const entry = await BalanceLiftingParty.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Balance lifting party entry not found')
    logger.info('Balance lifting party entry updated', { id, millId, userId })
    return entry
}

export const deleteBalanceLiftingPartyEntry = async (millId, id) => {
    const entry = await BalanceLiftingParty.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Balance lifting party entry not found')
    logger.info('Balance lifting party entry deleted', { id, millId })
}

export const bulkDeleteBalanceLiftingPartyEntries = async (millId, ids) => {
    const result = await BalanceLiftingParty.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Balance lifting party entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
