import mongoose from 'mongoose'
import { OtherPurchase } from '../models/other-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createOtherPurchaseEntry = async (millId, data) => {
    const entry = new OtherPurchase({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Other purchase entry created', {
        id: entry._id,
        millId,
    })
    return entry
}

export const getOtherPurchaseById = async (millId, id) => {
    const entry = await OtherPurchase.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other purchase entry not found')
    return entry
}

export const getOtherPurchaseList = async (millId, options = {}) => {
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
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { brokerName: { $regex: search, $options: 'i' } },
            { otherPurchaseName: { $regex: search, $options: 'i' } },
        ]

    const aggregate = OtherPurchase.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await OtherPurchase.aggregatePaginate(aggregate, {
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

export const getOtherPurchaseSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await OtherPurchase.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalQuantity: { $sum: '$otherPurchaseQty' },
                totalAmount: {
                    $sum: {
                        $multiply: [
                            { $ifNull: ['$otherPurchaseQty', 0] },
                            { $ifNull: ['$rate', 0] },
                        ],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalQuantity: 1,
                totalAmount: { $round: ['$totalAmount', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalQuantity: 0, totalAmount: 0 }
}

export const updateOtherPurchaseEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await OtherPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Other purchase entry not found')
    logger.info('Other purchase entry updated', { id, millId })
    return entry
}

export const deleteOtherPurchaseEntry = async (millId, id) => {
    const entry = await OtherPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other purchase entry not found')
    logger.info('Other purchase entry deleted', { id, millId })
}

export const bulkDeleteOtherPurchaseEntries = async (millId, ids) => {
    const result = await OtherPurchase.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Other purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
