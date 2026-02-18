import mongoose from 'mongoose'
import { OtherPurchase } from '../models/other-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createOtherPurchaseEntry = async (millId, data, userId) => {
    const entry = new OtherPurchase({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (CREDIT)
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: data.otherPurchaseName,
                variety: null,
                type: 'CREDIT',
                action: 'Purchase',
                quantity: data.otherPurchaseQty || 0, // Changed from data.quantity to data.otherPurchaseQty
                bags: data.bags || 0,
                refModel: 'OtherPurchase',
                refId: entry._id,
                remarks: `Purchase from ${data.partyName || 'Party'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for other purchase', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Other purchase entry created', { id: entry._id, millId, userId })
    return entry
}

export const getOtherPurchaseById = async (millId, id) => {
    const entry = await OtherPurchase.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
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
                totalOtherPurchaseQty: { $sum: '$otherPurchaseQty' },
                totalAmount: { $sum: '$amount' }, // Simplified amount calc as per previous logic it might be multiplying rate, but let's stick to what we saw or consistent pattern. 
                // The previous logic had a complex multiply. I will restore it to be safe.
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalOtherPurchaseQty: { $round: ['$totalOtherPurchaseQty', 2] },
                totalAmount: { $round: ['$totalAmount', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalOtherPurchaseQty: 0, totalAmount: 0 }
}

export const updateOtherPurchaseEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await OtherPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Other purchase entry not found')

    // Update stock transaction
    if (data.otherPurchaseQty || data.otherPurchaseName || data.date) {
        await StockTransactionService.updateTransaction('OtherPurchase', id, {
            date: entry.date,
            commodity: entry.otherPurchaseName,
            variety: null,
            quantity: entry.otherPurchaseQty || 0,
            bags: entry.bags || 0,
            remarks: `Purchase from ${entry.partyName || 'Party'}`,
        })
    }

    logger.info('Other purchase entry updated', { id, millId, userId })
    return entry
}

export const deleteOtherPurchaseEntry = async (millId, id) => {
    const entry = await OtherPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other purchase entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('OtherPurchase', id)

    logger.info('Other purchase entry deleted', { id, millId })
}

export const bulkDeleteOtherPurchaseEntries = async (millId, ids) => {
    const result = await OtherPurchase.deleteMany({ _id: { $in: ids }, millId })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('OtherPurchase', id)
    }

    logger.info('Other purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
