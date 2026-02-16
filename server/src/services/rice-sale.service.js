import mongoose from 'mongoose'
import { RiceSale } from '../models/rice-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createRiceSaleEntry = async (millId, data) => {
    const entry = new RiceSale({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (DEBIT = stock decrease)
    if (data.riceQty && data.riceType) {
        await StockTransactionService.recordTransaction(millId, {
            date: data.date,
            commodity: 'Rice',
            variety: data.riceType,
            type: 'DEBIT',
            action: 'Sale',
            quantity: data.riceQty,
            bags: data.bags || 0,
            refModel: 'RiceSale',
            refId: entry._id,
            remarks: `Sale to ${data.partyName || 'Party'}`,
        })
    }

    logger.info('Rice sale entry created', { id: entry._id, millId })
    return entry
}

export const getRiceSaleById = async (millId, id) => {
    const entry = await RiceSale.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Rice sale entry not found')
    return entry
}

export const getRiceSaleList = async (millId, options = {}) => {
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

    const aggregate = RiceSale.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'privatericeoutwards',
                localField: 'riceSalesDealNumber',
                foreignField: 'riceSaleDealNumber',
                as: 'outwardData',
            },
        },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])

    const result = await RiceSale.aggregatePaginate(aggregate, {
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

export const getRiceSaleSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await RiceSale.aggregate([
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

export const updateRiceSaleEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await RiceSale.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Rice sale entry not found')

    // Update stock transaction if quantity or type changed
    if (data.riceQty || data.riceType || data.date) {
        await StockTransactionService.updateTransaction('RiceSale', id, {
            date: entry.date,
            commodity: 'Rice',
            variety: entry.riceType,
            quantity: entry.riceQty,
            bags: entry.bags || 0,
            remarks: `Sale to ${entry.partyName || 'Party'}`,
        })
    }

    logger.info('Rice sale entry updated', { id, millId })
    return entry
}

export const deleteRiceSaleEntry = async (millId, id) => {
    const entry = await RiceSale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Rice sale entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('RiceSale', id)

    logger.info('Rice sale entry deleted', { id, millId })
}

export const bulkDeleteRiceSaleEntries = async (millId, ids) => {
    const result = await RiceSale.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Rice sale entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
