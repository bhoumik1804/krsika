import mongoose from 'mongoose'
import { DailyPurchaseDeal } from '../models/daily-purchase-deal.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createDailyPurchaseDealEntry = async (millId, data, userId) => {
    const entry = new DailyPurchaseDeal({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (CREDIT = stock increase)
    if (data.commodity && data.quantity) {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: data.commodity,
                variety: data.commodityType || null,
                type: 'CREDIT',
                action: 'Purchase Deal',
                quantity: data.quantity,
                bags: data.bags || 0,
                refModel: 'DailyPurchaseDeal',
                refId: entry._id,
                remarks: `Purchase deal from ${data.farmerName || 'Farmer'}`,
            },
            userId
        )
    }

    logger.info('Daily purchase deal entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getDailyPurchaseDealById = async (millId, id) => {
    const entry = await DailyPurchaseDeal.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily purchase deal entry not found')
    return entry
}

export const getDailyPurchaseDealList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        status,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (status) matchStage.status = status
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { brokerName: { $regex: search, $options: 'i' } },
            { item: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DailyPurchaseDeal.aggregate([
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

    const result = await DailyPurchaseDeal.aggregatePaginate(aggregate, {
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

export const getDailyPurchaseDealSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailyPurchaseDeal.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                totalAmount: { $sum: '$amount' },
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

export const updateDailyPurchaseDealEntry = async (
    millId,
    id,
    data,
    userId
) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await DailyPurchaseDeal.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily purchase deal entry not found')

    // Update stock transaction if quantity or commodity changed
    if (data.commodity || data.quantity || data.date) {
        await StockTransactionService.updateTransaction(
            'DailyPurchaseDeal',
            id,
            {
                date: entry.date,
                commodity: entry.commodity,
                variety: entry.commodityType || null,
                quantity: entry.quantity,
                bags: entry.bags || 0,
                remarks: `Purchase deal from ${entry.farmerName || 'Farmer'}`,
            }
        )
    }

    logger.info('Daily purchase deal entry updated', { id, millId, userId })
    return entry
}

export const deleteDailyPurchaseDealEntry = async (millId, id) => {
    const entry = await DailyPurchaseDeal.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Daily purchase deal entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef(
        'DailyPurchaseDeal',
        id
    )

    logger.info('Daily purchase deal entry deleted', { id, millId })
}

export const bulkDeleteDailyPurchaseDealEntries = async (millId, ids) => {
    const result = await DailyPurchaseDeal.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Daily purchase deal entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
