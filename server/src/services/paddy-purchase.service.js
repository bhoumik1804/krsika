import mongoose from 'mongoose'
import { PaddyPurchase } from '../models/paddy-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createPaddyPurchaseEntry = async (millId, data, userId) => {
    const entry = new PaddyPurchase({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    console.log(data)
    // Record stock transaction (CREDIT = stock increase)
    try {
        console.log('Recording 111 stock transaction for paddy purchase', {
            id: entry._id,
        })
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: 'Paddy',
                variety: data.paddyType,
                type: 'CREDIT',
                action: 'Purchase',
                quantity: data.totalPaddyQty || 0,
                bags: data.bags || 0,
                refModel: 'PaddyPurchase',
                refId: entry._id,
                remarks: `Purchase from ${data.partyName || 'Party'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for paddy purchase', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Paddy purchase entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getPaddyPurchaseById = async (millId, id) => {
    const entry = await PaddyPurchase.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Paddy purchase entry not found')
    return entry
}

export const getPaddyPurchaseList = async (millId, options = {}) => {
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
        ]

    const aggregate = PaddyPurchase.aggregate([
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
            $lookup: {
                from: 'privatepaddyinwards',
                localField: 'paddyPurchaseDealNumber',
                foreignField: 'paddyPurchaseDealNumber',
                as: 'inwardData',
            },
        },
        {
            $unwind: {
                path: '$createdByUser',
                preserveNullAndEmptyArrays: true,
            },
        },
    ])
    const result = await PaddyPurchase.aggregatePaginate(aggregate, {
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

export const getPaddyPurchaseSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await PaddyPurchase.aggregate([
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

export const updatePaddyPurchaseEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await PaddyPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Paddy purchase entry not found')

    // Update stock transaction if quantity or type changed
    if (data.totalPaddyQty || data.paddyType || data.date) {
        await StockTransactionService.updateTransaction('PaddyPurchase', id, {
            date: entry.date,
            commodity: 'Paddy',
            variety: entry.paddyType,
            quantity: entry.totalPaddyQty || 0,
            bags: entry.bags || 0,
            remarks: `Purchase from ${entry.partyName || 'Party'}`,
        })
    }

    logger.info('Paddy purchase entry updated', { id, millId, userId })
    return entry
}

export const deletePaddyPurchaseEntry = async (millId, id) => {
    const entry = await PaddyPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Paddy purchase entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('PaddyPurchase', id)

    logger.info('Paddy purchase entry deleted', { id, millId })
}

export const bulkDeletePaddyPurchaseEntries = async (millId, ids) => {
    const result = await PaddyPurchase.deleteMany({ _id: { $in: ids }, millId })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('PaddyPurchase', id)
    }

    logger.info('Paddy purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
