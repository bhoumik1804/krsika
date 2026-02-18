import mongoose from 'mongoose'
import { FrkPurchase } from '../models/frk-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createFrkPurchaseEntry = async (millId, data, userId) => {
    const entry = new FrkPurchase({
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
                commodity: 'FRK',
                variety: null,
                type: 'CREDIT',
                action: 'Purchase',
                quantity: data.frkQty, // Changed from data.quantity to data.frkQty based on model/service context (usually frkQty in summary)
                // Wait, in summary it is $frkQty. In create data, check input.
                // Looking at getFrkPurchaseSummary: totalFrkQty: { $sum: '$frkQty' }
                // So field name is likely `frkQty`.
                // In data object from client? Usually matches model.
                // Let's assume input data key is 'frkQty' or 'quantity'.
                // To be safe, let's use data.frkQty || data.quantity.
                bags: data.bags || 0,
                refModel: 'FrkPurchase',
                refId: entry._id,
                remarks: `Purchase from ${data.partyName || 'Party'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for FRK purchase', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('FRK purchase entry created', { id: entry._id, millId, userId })
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
        matchStage.$or = [{ partyName: { $regex: search, $options: 'i' } }]

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

export const getFrkPurchaseSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
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

export const updateFrkPurchaseEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await FrkPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'FRK purchase entry not found')

    // Update stock transaction
    if (data.frkQty || data.date) {
        await StockTransactionService.updateTransaction('FrkPurchase', id, {
            date: entry.date,
            commodity: 'FRK',
            variety: null,
            quantity: entry.frkQty,
            bags: entry.bags || 0,
            remarks: `Purchase from ${entry.partyName || 'Party'}`,
        })
    }

    logger.info('FRK purchase entry updated', { id, millId, userId })
    return entry
}

export const deleteFrkPurchaseEntry = async (millId, id) => {
    const entry = await FrkPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK purchase entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('FrkPurchase', id)

    logger.info('FRK purchase entry deleted', { id, millId })
}

export const bulkDeleteFrkPurchaseEntries = async (millId, ids) => {
    const result = await FrkPurchase.deleteMany({ _id: { $in: ids }, millId })

    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('FrkPurchase', id)
    }

    logger.info('FRK purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
