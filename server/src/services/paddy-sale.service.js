import mongoose from 'mongoose'
import { PaddySale } from '../models/paddy-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createPaddySaleEntry = async (millId, data) => {
    const entry = await PaddySale.create({ ...data, millId })

    // Record stock transaction (DEBIT)
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: 'Paddy',
                variety: null, // Paddy sale usually has mixed varieties or specific ones? 
                             // Model has dhanMotaQty, dhanPatlaQty etc.
                             // We might need to record multiple transactions or a summary.
                             // For now, let's treat it as generic 'Paddy' or check if there's a main type?
                             // The summary uses dhanMotaQty etc.
                             // If we track total quantity:
                type: 'DEBIT',
                action: 'Sale',
                quantity: data.dhanQty,
                bags: data.bags || 0,
                refModel: 'PaddySale',
                refId: entry._id,
                remarks: `Sale to ${data.partyName || 'Party'}`,
            }
        )
    } catch (err) {
        logger.error('Failed to record stock for paddy sale', {
            id: entry._id,
            error: err.message,
        })
    }

    return entry
}

export const getPaddySaleList = async (millId, query) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'date',
        order = 'desc',
        startDate,
        endDate,
    } = query

    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { brokerName: { $regex: search, $options: 'i' } },
            { doNumber: { $regex: search, $options: 'i' } },
            { paddySalesDealNumber: { $regex: search, $options: 'i' } },
        ]
    }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate)
    }

    const sortStage = { [sortBy]: order === 'desc' ? -1 : 1 }

    const aggregate = PaddySale.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'privatepaddyoutwards',
                localField: 'paddySalesDealNumber',
                foreignField: 'paddySaleDealNumber',
                as: 'outwardData',
            },
        },
        { $sort: sortStage },
    ])

    return await PaddySale.aggregatePaginate(aggregate, {
        page,
        limit,
        customLabels: {
            docs: 'data',
            totalDocs: 'total',
            limit: 'pageSize',
            page: 'currentPage',
            totalPages: 'totalPages',
        },
    })
}

export const getPaddySaleById = async (millId, id) => {
    return await PaddySale.findOne({ _id: id, millId })
}

export const updatePaddySaleEntry = async (millId, id, data) => {
    const entry = await PaddySale.findOneAndUpdate({ _id: id, millId }, data, {
        new: true,
        runValidators: true,
    })
    
    if (!entry) throw new ApiError(404, 'Paddy sale entry not found')

    // Update stock transaction
    await StockTransactionService.updateTransaction('PaddySale', id, {
        date: entry.date,
        commodity: 'Paddy',
        variety: null,
        quantity: entry.dhanQty,
        bags: entry.bags || 0,
        remarks: `Sale to ${entry.partyName || 'Party'}`,
    })

    return entry
}

export const deletePaddySaleEntry = async (millId, id) => {
    const entry = await PaddySale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Paddy sale entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('PaddySale', id)

    return entry
}

export const bulkDeletePaddySaleEntries = async (millId, ids) => {
    const result = await PaddySale.deleteMany({
        _id: { $in: ids },
        millId,
    })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('PaddySale', id)
    }

    return result.deletedCount // or result
}

export const getPaddySaleSummary = async (millId, startDate, endDate) => {
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate)
    }

    const summary = await PaddySale.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalDhanMotaQty: { $sum: '$dhanMotaQty' },
                totalDhanPatlaQty: { $sum: '$dhanPatlaQty' },
                totalDhanSarnaQty: { $sum: '$dhanSarnaQty' },
                totalDhanQty: { $sum: '$dhanQty' }, // fallback if using dhanQty directly
                count: { $sum: 1 },
            },
        },
    ])

    return (
        summary[0] || {
            totalDhanMotaQty: 0,
            totalDhanPatlaQty: 0,
            totalDhanSarnaQty: 0,
            totalDhanQty: 0,
            count: 0,
        }
    )
}
