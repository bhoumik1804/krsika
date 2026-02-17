import mongoose from 'mongoose'
import { RicePurchase } from '../models/rice-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createRicePurchaseEntry = async (millId, data, userId) => {
    const entry = new RicePurchase({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (CREDIT = stock increase)
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: 'Rice',
                variety: data.riceType,
                type: 'CREDIT',
                action: 'Purchase',
                quantity: data.totalRiceQty,
                bags: data.bags || 0,
                refModel: 'RicePurchase',
                refId: entry._id,
                remarks: `Purchase from ${data.partyName || 'Party'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for rice purchase', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Rice purchase entry created', { id: entry._id, millId, userId })
    return entry
}

export const getRicePurchaseById = async (millId, id) => {
    const entry = await RicePurchase.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Rice purchase entry not found')
    return entry
}

export const getRicePurchaseList = async (millId, options = {}) => {
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
            { riceType: { $regex: search, $options: 'i' } },
        ]

    const aggregate = RicePurchase.aggregate([
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
    const result = await RicePurchase.aggregatePaginate(aggregate, {
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

export const getRicePurchaseSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await RicePurchase.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalRiceQty: { $sum: '$riceQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalRiceQty: { $round: ['$totalRiceQty', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalRiceQty: 0 }
}

export const updateRicePurchaseEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await RicePurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Rice purchase entry not found')

    // Update stock transaction if quantity or type changed
    if (data.totalRiceQty || data.riceType || data.date) {
        await StockTransactionService.updateTransaction('RicePurchase', id, {
            date: entry.date,
            commodity: 'Rice',
            variety: entry.riceType,
            quantity: entry.totalRiceQty,
            bags: entry.bags || 0,
            remarks: `Purchase from ${entry.partyName || 'Party'}`,
        })
    }

    logger.info('Rice purchase entry updated', { id, millId, userId })
    return entry
}

export const deleteRicePurchaseEntry = async (millId, id) => {
    const entry = await RicePurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Rice purchase entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('RicePurchase', id)

    logger.info('Rice purchase entry deleted', { id, millId })
}

export const bulkDeleteRicePurchaseEntries = async (millId, ids) => {
    const result = await RicePurchase.deleteMany({ _id: { $in: ids }, millId })
    
    // Bulk delete stock transactions
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('RicePurchase', id)
    }

    logger.info('Rice purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
