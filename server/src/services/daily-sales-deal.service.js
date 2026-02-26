import mongoose from 'mongoose'
import { DailySalesDeal } from '../models/daily-sales-deal.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createDailySalesDealEntry = async (millId, data, userId) => {
    const entry = new DailySalesDeal({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (DEBIT = stock decrease)
    // Removed conditional checks to ensure consistent logging
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: data.commodity,
                variety: data.commodityType || null,
                type: 'DEBIT',
                action: 'Sales Deal',
                quantity: data.quantity,
                bags: data.bags || 0,
                refModel: 'DailySalesDeal',
                refId: entry._id,
                remarks: `Sales deal to ${data.buyerName || 'Buyer'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for daily sales deal', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Daily sales deal entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getDailySalesDealById = async (millId, id) => {
    const entry = await DailySalesDeal.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily sales deal entry not found')
    return entry
}

export const getDailySalesDealList = async (millId, options = {}) => {
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

    const aggregate = DailySalesDeal.aggregate([
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

    const result = await DailySalesDeal.aggregatePaginate(aggregate, {
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

export const getDailySalesDealSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailySalesDeal.aggregate([
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

export const updateDailySalesDealEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await DailySalesDeal.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily sales deal entry not found')

    // Update stock transaction
    // Removed conditional checks
    await StockTransactionService.updateTransaction('DailySalesDeal', id, {
        date: entry.date,
        commodity: entry.commodity,
        variety: entry.commodityType || null,
        quantity: entry.quantity,
        bags: entry.bags || 0,
        remarks: `Sales deal to ${entry.buyerName || 'Buyer'}`,
    })

    logger.info('Daily sales deal entry updated', { id, millId, userId })
    return entry
}

export const deleteDailySalesDealEntry = async (millId, id) => {
    const entry = await DailySalesDeal.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Daily sales deal entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('DailySalesDeal', id)

    logger.info('Daily sales deal entry deleted', { id, millId })
}

export const bulkDeleteDailySalesDealEntries = async (millId, ids) => {
    const result = await DailySalesDeal.deleteMany({
        _id: { $in: ids },
        millId,
    })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('DailySalesDeal', id)
    }

    logger.info('Daily sales deal entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
