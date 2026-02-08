import mongoose from 'mongoose'
import { FrkPurchase } from '../models/frk-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createFrkPurchaseEntry = async (millId, data) => {
    const entry = new FrkPurchase({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('FRK purchase entry created', { id: entry._id, millId })
    return entry
}

export const getFrkPurchaseById = async (millId, id) => {
    const entry = await FrkPurchase.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK purchase entry not found')
    return entry
}

export const getFrkPurchaseList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [{ partyName: { $regex: search, $options: 'i' } }]
    }

    const aggregate = FrkPurchase.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])

    const result = await FrkPurchase.aggregatePaginate(aggregate, {
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

export const getFrkPurchaseSummary = async (millId) => {
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    const [summary] = await FrkPurchase.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalFrkQty: { $sum: '$frkQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalFrkQty: { $round: ['$totalFrkQty', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalFrkQty: 0 }
}

export const updateFrkPurchaseEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await FrkPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'FRK purchase entry not found')
    logger.info('FRK purchase entry updated', { id, millId })
    return entry
}

export const deleteFrkPurchaseEntry = async (millId, id) => {
    const entry = await FrkPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK purchase entry not found')
    logger.info('FRK purchase entry deleted', { id, millId })
}

export const bulkDeleteFrkPurchaseEntries = async (millId, ids) => {
    const result = await FrkPurchase.deleteMany({ _id: { $in: ids }, millId })
    logger.info('FRK purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
