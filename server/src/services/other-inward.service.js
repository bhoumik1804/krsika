import mongoose from 'mongoose'
import { OtherInward } from '../models/other-inward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createOtherInwardEntry = async (millId, data, userId) => {
    const entry = new OtherInward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Other inward entry created', { id: entry._id, millId })

    // Record stock transaction (CREDIT - incoming other items)
    try {
        const qty = entry.netWeight || entry.quantity || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: entry.itemName,
            variety: null,
            type: 'CREDIT',
            action: 'Inward',
            quantity: (entry.netWeight ? entry.netWeight / 100 : entry.quantity) || 0, // Kg to Qtl if weight
            bags: 0,
            refModel: 'OtherInward',
            refId: entry._id,
            remarks: `Other Inward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for other inward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getOtherInwardById = async (millId, id) => {
    const entry = await OtherInward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other inward entry not found')
    return entry
}

export const getOtherInwardList = async (millId, options = {}) => {
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
            { itemName: { $regex: search, $options: 'i' } },
            { otherPurchaseDealNumber: { $regex: search, $options: 'i' } },
            { truckNumber: { $regex: search, $options: 'i' } },
        ]

    const aggregate = OtherInward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await OtherInward.aggregatePaginate(aggregate, {
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

export const getOtherInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await OtherInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                totalNetWeight: { $sum: '$netWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalQuantity: 1,
                totalNetWeight: { $round: ['$totalNetWeight', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalQuantity: 0, totalNetWeight: 0 }
}

export const updateOtherInwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await OtherInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Other inward entry not found')
    logger.info('Other inward entry updated', { id, millId })
    return entry
}

export const deleteOtherInwardEntry = async (millId, id) => {
    const entry = await OtherInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other inward entry not found')
    logger.info('Other inward entry deleted', { id, millId })
}

export const bulkDeleteOtherInwardEntries = async (millId, ids) => {
    const result = await OtherInward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Other inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
