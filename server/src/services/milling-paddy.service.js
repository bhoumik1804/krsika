import mongoose from 'mongoose'
import { MillingPaddy } from '../models/milling-paddy.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createMillingPaddyEntry = async (millId, data, userId) => {
    const entry = new MillingPaddy({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Milling paddy entry created', {
        id: entry._id,
        millId,
        userId,
    })

    // Record stock transaction (DEBIT - paddy consumed in milling)
    try {
        const qty = entry.hopperInQintal || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Paddy',
            variety: entry.paddyType || null,
            type: 'DEBIT',
            action: 'Milling',
            quantity: qty,
            bags: entry.hopperInGunny || 0,
            refModel: 'MillingPaddy',
            refId: entry._id,
            remarks: `Milling Paddy - ${entry.paddyType || 'Unknown'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for milling paddy', { id: entry._id, error: err.message })
    }

    return entry
}

export const getMillingPaddyById = async (millId, id) => {
    const entry = await MillingPaddy.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Milling paddy entry not found')
    return entry
}

export const getMillingPaddyList = async (millId, options = {}) => {
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
    if (search)
        matchStage.$or = [{ paddyType: { $regex: search, $options: 'i' } }]

    const aggregate = MillingPaddy.aggregate([
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
    const result = await MillingPaddy.aggregatePaginate(aggregate, {
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

export const getMillingPaddySummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await MillingPaddy.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalInput: { $sum: '$inputWeight' },
                totalOutput: { $sum: '$outputWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalInput: { $round: ['$totalInput', 2] },
                totalOutput: { $round: ['$totalOutput', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalInput: 0, totalOutput: 0 }
}

export const updateMillingPaddyEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await MillingPaddy.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Milling paddy entry not found')
    logger.info('Milling paddy entry updated', { id, millId, userId })
    return entry
}

export const deleteMillingPaddyEntry = async (millId, id) => {
    const entry = await MillingPaddy.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Milling paddy entry not found')
    logger.info('Milling paddy entry deleted', { id, millId })
}

export const bulkDeleteMillingPaddyEntries = async (millId, ids) => {
    const result = await MillingPaddy.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Milling paddy entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
