import mongoose from 'mongoose'
import { PartyTransaction } from '../models/party-transaction.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createPartyTransactionEntry = async (millId, data, userId) => {
    const entry = new PartyTransaction({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Party transaction entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getPartyTransactionById = async (millId, id) => {
    const entry = await PartyTransaction.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Party transaction entry not found')
    return entry
}

export const getPartyTransactionList = async (millId, options = {}) => {
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
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { transactionType: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = PartyTransaction.aggregate([
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

    const result = await PartyTransaction.aggregatePaginate(aggregate, {
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

export const getPartyTransactionSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await PartyTransaction.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalAmount: { $round: ['$totalAmount', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalAmount: 0 }
}

export const updatePartyTransactionEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await PartyTransaction.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Party transaction entry not found')
    logger.info('Party transaction entry updated', { id, millId, userId })
    return entry
}

export const deletePartyTransactionEntry = async (millId, id) => {
    const entry = await PartyTransaction.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Party transaction entry not found')
    logger.info('Party transaction entry deleted', { id, millId })
}

export const bulkDeletePartyTransactionEntries = async (millId, ids) => {
    const result = await PartyTransaction.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Party transaction entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
