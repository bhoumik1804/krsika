import mongoose from 'mongoose'
import { KhandaSale } from '../models/khanda-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createKhandaSaleEntry = async (millId, data) => {
    const entry = new KhandaSale({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (DEBIT)
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: 'Khanda',
                variety: null,
                type: 'DEBIT',
                action: 'Sale',
                quantity: data.khandaQty, // Check model for field name
                bags: data.bags || 0,
                refModel: 'KhandaSale',
                refId: entry._id,
                remarks: `Sale to ${data.partyName || 'Party'}`,
            }
        )
    } catch (err) {
        logger.error('Failed to record stock for khanda sale', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Khanda sale entry created', { id: entry._id, millId })
    return entry
}

export const getKhandaSaleById = async (millId, id) => {
    const entry = await KhandaSale.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Khanda sale entry not found')
    return entry
}

export const getKhandaSaleList = async (millId, options = {}) => {
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

    const aggregate = KhandaSale.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await KhandaSale.aggregatePaginate(aggregate, {
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

export const getKhandaSaleSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await KhandaSale.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalKhandaQty: { $sum: '$khandaQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalKhandaQty: { $round: ['$totalKhandaQty', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalKhandaQty: 0 }
}

export const updateKhandaSaleEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await KhandaSale.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Khanda sale entry not found')

    // Update stock transaction
    await StockTransactionService.updateTransaction('KhandaSale', id, {
        date: entry.date,
        commodity: 'Khanda',
        variety: null,
        quantity: entry.khandaQty,
        bags: entry.bags || 0,
        remarks: `Sale to ${entry.partyName || 'Party'}`,
    })

    logger.info('Khanda sale entry updated', { id, millId })
    return entry
}

export const deleteKhandaSaleEntry = async (millId, id) => {
    const entry = await KhandaSale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Khanda sale entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('KhandaSale', id)

    logger.info('Khanda sale entry deleted', { id, millId })
}

export const bulkDeleteKhandaSaleEntries = async (millId, ids) => {
    const result = await KhandaSale.deleteMany({ _id: { $in: ids }, millId })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('KhandaSale', id)
    }

    logger.info('Khanda sale entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
