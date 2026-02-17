import mongoose from 'mongoose'
import { FrkSale } from '../models/frk-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createFrkSaleEntry = async (millId, data, userId) => {
    const entry = new FrkSale({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (DEBIT)
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: 'FRK',
                variety: null,
                type: 'DEBIT',
                action: 'Sale',
                quantity: data.quantity, 
                bags: data.bags || 0,
                refModel: 'FrkSale',
                refId: entry._id,
                remarks: `Sale to ${data.partyName || 'Party'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for FRK sale', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('FRK sale entry created', { id: entry._id, millId, userId })
    return entry
}

export const getFrkSaleById = async (millId, id) => {
    const entry = await FrkSale.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'FRK sale entry not found')
    return entry
}

export const getFrkSaleList = async (millId, options = {}) => {
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
            { brokerName: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = FrkSale.aggregate([
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

    const result = await FrkSale.aggregatePaginate(aggregate, {
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

export const getFrkSaleSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await FrkSale.aggregate([
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

export const updateFrkSaleEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await FrkSale.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'FRK sale entry not found')

    // Update stock transaction
    await StockTransactionService.updateTransaction('FrkSale', id, {
        date: entry.date,
        commodity: 'FRK',
        variety: null,
        quantity: entry.quantity,
        bags: entry.bags || 0,
        remarks: `Sale to ${entry.partyName || 'Party'}`,
    })

    logger.info('FRK sale entry updated', { id, millId, userId })
    return entry
}

export const deleteFrkSaleEntry = async (millId, id) => {
    const entry = await FrkSale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK sale entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('FrkSale', id)

    logger.info('FRK sale entry deleted', { id, millId })
}

export const bulkDeleteFrkSaleEntries = async (millId, ids) => {
    const result = await FrkSale.deleteMany({ _id: { $in: ids }, millId })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('FrkSale', id)
    }

    logger.info('FRK sale entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
