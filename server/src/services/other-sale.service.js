import mongoose from 'mongoose'
import { OtherSale } from '../models/other-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createOtherSaleEntry = async (millId, data) => {
    const entry = new OtherSale({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (DEBIT)
    try {
        await StockTransactionService.recordTransaction(millId, {
            date: data.date,
            commodity: data.otherSaleName, // Using item name as commodity
            variety: null,
            type: 'DEBIT',
            action: 'Sale',
            quantity: data.otherSaleQty,
            bags: data.bags || 0,
            refModel: 'OtherSale',
            refId: entry._id,
            remarks: `Sale to ${data.partyName || 'Party'}`,
        })
    } catch (err) {
        logger.error('Failed to record stock for other sale', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Other sale entry created', { id: entry._id, millId })
    return entry
}

export const getOtherSaleById = async (millId, id) => {
    const entry = await OtherSale.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other sale entry not found')
    return entry
}

export const getOtherSaleList = async (millId, options = {}) => {
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
            { otherSaleName: { $regex: search, $options: 'i' } },
        ]

    const aggregate = OtherSale.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await OtherSale.aggregatePaginate(aggregate, {
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

export const getOtherSaleSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await OtherSale.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalOtherSaleQty: { $sum: '$otherSaleQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalOtherSaleQty: { $round: ['$totalOtherSaleQty', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalOtherSaleQty: 0 }
}

export const updateOtherSaleEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await OtherSale.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Other sale entry not found')

    // Update stock transaction
    const stockData = {
        date: entry.date,
        commodity: entry.otherSaleName,
        variety: null,
        type: 'DEBIT',
        action: 'Sale',
        quantity: entry.otherSaleQty || 0,
        bags: entry.bags || 0,
        remarks: `Sale to ${entry.partyName || 'Party'}`,
    }

    if (entry.otherSaleName) {
        const updatedStock = await StockTransactionService.updateTransaction(
            'OtherSale',
            id,
            stockData
        )
    }

    logger.info('Other sale entry updated', { id, millId })
    return entry
}

export const deleteOtherSaleEntry = async (millId, id) => {
    const entry = await OtherSale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other sale entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('OtherSale', id)

    logger.info('Other sale entry deleted', { id, millId })
}

export const bulkDeleteOtherSaleEntries = async (millId, ids) => {
    const result = await OtherSale.deleteMany({ _id: { $in: ids }, millId })

    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('OtherSale', id)
    }

    logger.info('Other sale entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
