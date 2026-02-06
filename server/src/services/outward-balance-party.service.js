import mongoose from 'mongoose'
import { OutwardBalanceParty } from '../models/outward-balance-party.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createOutwardBalancePartyEntry = async (millId, data, userId) => {
    const entry = new OutwardBalanceParty({
        ...data,
        millId,
        createdBy: userId,
    })
    await entry.save()
    logger.info('Outward balance party entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getOutwardBalancePartyById = async (millId, id) => {
    const entry = await OutwardBalanceParty.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Outward balance party entry not found')
    return entry
}

export const getOutwardBalancePartyList = async (millId, options = {}) => {
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

    const aggregate = OutwardBalanceParty.aggregate([
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
}

export const getOutwardBalancePartySummary = async (millId) => {
    const [summary] = await OutwardBalanceParty.aggregate([
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

export const updateOutwardBalancePartyEntry = async (
    millId,
    id,
    data,
    userId
) => {
    const entry = await OutwardBalanceParty.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Outward balance party entry not found')
    logger.info('Outward balance party entry updated', { id, millId, userId })
    return entry
}

export const deleteOutwardBalancePartyEntry = async (millId, id) => {
    const entry = await OutwardBalanceParty.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Outward balance party entry not found')
    logger.info('Outward balance party entry deleted', { id, millId })
}

export const bulkDeleteOutwardBalancePartyEntries = async (millId, ids) => {
    const result = await OutwardBalanceParty.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Outward balance party entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
