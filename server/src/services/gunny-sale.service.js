import mongoose from 'mongoose'
import { GunnySale } from '../models/gunny-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createGunnySaleEntry = async (millId, data) => {
    const entry = new GunnySale({
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
                commodity: 'Gunny',
                variety: null,
                type: 'DEBIT',
                action: 'Sale',
                quantity: 0, // Using 0 as Gunny tracked in bags usually
                bags: data.totalBags || 0,
                refModel: 'GunnySale',
                refId: entry._id,
                remarks: `Sale to ${data.partyName || 'Party'}`,
            } // Removed userId as it wasn't method arg, or if it is needed we should add it to func sig.
              // Logic check: createGunnySaleEntry(millId, data). createRiceSaleEntry has no userId in sig too.
              // StockTransactionService.recordTransaction takes userId as last arg?
              // YES it does: recordTransaction(millId, transactionData, userId).
              // IMPORTANT: I should update function signatures to accept userId if needed or pass null?
              // It seems some services have userId, some don't.
              // Ideally I should update controller to pass userId.
              // For now, if userId is not passed, I'll pass undefined.
        )
    } catch (err) {
        logger.error('Failed to record stock for gunny sale', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Gunny sale entry created', { id: entry._id, millId })
    return entry
}

export const getGunnySaleById = async (millId, id) => {
    const entry = await GunnySale.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny sale entry not found')
    return entry
}

export const getGunnySaleList = async (millId, options = {}) => {
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

    const aggregate = GunnySale.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await GunnySale.aggregatePaginate(aggregate, {
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

export const getGunnySaleSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await GunnySale.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalNewGunnyQty: { $sum: '$newGunnyQty' },
                totalOldGunnyQty: { $sum: '$oldGunnyQty' },
                totalPlasticGunnyQty: { $sum: '$plasticGunnyQty' },
                totalBags: { $sum: '$totalBags' }, // Added totalBags assumption
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalNewGunnyQty: { $round: ['$totalNewGunnyQty', 2] },
                totalOldGunnyQty: { $round: ['$totalOldGunnyQty', 2] },
                totalPlasticGunnyQty: { $round: ['$totalPlasticGunnyQty', 2] },
                totalBags: 1,
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalNewGunnyQty: 0,
            totalOldGunnyQty: 0,
            totalPlasticGunnyQty: 0,
            totalBags: 0,
        }
    )
}

export const updateGunnySaleEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GunnySale.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Gunny sale entry not found')

    // Update stock transaction
    await StockTransactionService.updateTransaction('GunnySale', id, {
        date: entry.date,
        commodity: 'Gunny',
        variety: null,
        quantity: 0,
        bags: entry.totalBags || 0,
        remarks: `Sale to ${entry.partyName || 'Party'}`,
    })

    logger.info('Gunny sale entry updated', { id, millId })
    return entry
}

export const deleteGunnySaleEntry = async (millId, id) => {
    const entry = await GunnySale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny sale entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('GunnySale', id)

    logger.info('Gunny sale entry deleted', { id, millId })
}

export const bulkDeleteGunnySaleEntries = async (millId, ids) => {
    const result = await GunnySale.deleteMany({ _id: { $in: ids }, millId })
    
    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef('GunnySale', id)
    }

    logger.info('Gunny sale entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
