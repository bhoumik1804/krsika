import mongoose from 'mongoose'
import { FrkOutward } from '../models/frk-outward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createFrkOutwardEntry = async (millId, data, userId) => {
    const entry = new FrkOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('FRK outward entry created', {
        id: entry._id,
        millId,
    })

    // Record stock transaction (DEBIT - outgoing FRK)
    try {
        const qty = entry.netWeight || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'FRK',
            variety: null,
            type: 'DEBIT',
            action: 'Outward',
            quantity: qty / 100,
            bags: entry.gunnyPlastic || 0,
            refModel: 'FrkOutward',
            refId: entry._id,
            remarks: `FRK Outward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for FRK outward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getFrkOutwardById = async (millId, id) => {
    const entry = await FrkOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK outward entry not found')
    return entry
}

export const getFrkOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        partyName,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    // Date range filtering
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    // Individual field filtering
    if (partyName)
        matchStage.partyName = { $regex: escapeRegex(partyName), $options: 'i' }

    // Search across multiple fields
    if (search)
        matchStage.$or = [
            { partyName: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
            { truckRst: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = FrkOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await FrkOutward.aggregatePaginate(aggregate, {
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

export const getFrkOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await FrkOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalGunnyPlastic: { $sum: '$gunnyPlastic' },
                totalPlasticWeight: { $sum: '$plasticWeight' },
                totalTruckWeight: { $sum: '$truckWeight' },
                totalGunnyWeight: { $sum: '$gunnyWeight' },
                totalNetWeight: { $sum: '$netWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalGunnyPlastic: { $round: ['$totalGunnyPlastic', 2] },
                totalPlasticWeight: { $round: ['$totalPlasticWeight', 2] },
                totalTruckWeight: { $round: ['$totalTruckWeight', 2] },
                totalGunnyWeight: { $round: ['$totalGunnyWeight', 2] },
                totalNetWeight: { $round: ['$totalNetWeight', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalGunnyPlastic: 0,
            totalPlasticWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updateFrkOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await FrkOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'FRK outward entry not found')
    logger.info('FRK outward entry updated', { id, millId })
    return entry
}

export const deleteFrkOutwardEntry = async (millId, id) => {
    const entry = await FrkOutward.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'FRK outward entry not found')
    logger.info('FRK outward entry deleted', { id, millId })
}

export const bulkDeleteFrkOutwardEntries = async (millId, ids) => {
    const result = await FrkOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('FRK outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
