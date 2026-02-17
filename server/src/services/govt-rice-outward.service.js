import mongoose from 'mongoose'
import { GovtRiceOutward } from '../models/govt-rice-outward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createGovtRiceOutwardEntry = async (millId, data, userId) => {
    const entry = new GovtRiceOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Govt rice outward entry created', {
        id: entry._id,
        millId,
    })

    // Record stock transaction (DEBIT - outgoing rice)
    try {
        const qty = entry.netWeight || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Rice',
            variety: entry.riceType || null,
            type: 'DEBIT',
            action: 'Outward',
            quantity: qty / 100,
            bags: (entry.gunnyNew || 0) + (entry.gunnyOld || 0),
            refModel: 'GovtRiceOutward',
            refId: entry._id,
            remarks: `Govt Rice Outward - Lot ${entry.lotNo || 'N/A'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for govt rice outward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getGovtRiceOutwardById = async (millId, id) => {
    const entry = await GovtRiceOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Govt rice outward entry not found')
    return entry
}

export const getGovtRiceOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        riceType,
        lotNo,
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
    if (riceType)
        matchStage.riceType = { $regex: escapeRegex(riceType), $options: 'i' }
    if (lotNo) matchStage.lotNo = { $regex: escapeRegex(lotNo), $options: 'i' }

    // Search across multiple fields
    if (search)
        matchStage.$or = [
            { lotNo: { $regex: escapeRegex(search), $options: 'i' } },
            { fciNan: { $regex: escapeRegex(search), $options: 'i' } },
            { riceType: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
            { truckRst: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = GovtRiceOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await GovtRiceOutward.aggregatePaginate(aggregate, {
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

export const getGovtRiceOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await GovtRiceOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalGunnyNew: { $sum: '$gunnyNew' },
                totalGunnyOld: { $sum: '$gunnyOld' },
                totalJuteWeight: { $sum: '$juteWeight' },
                totalTruckWeight: { $sum: '$truckWeight' },
                totalGunnyWeight: { $sum: '$gunnyWeight' },
                totalNetWeight: { $sum: '$netWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalGunnyNew: { $round: ['$totalGunnyNew', 2] },
                totalGunnyOld: { $round: ['$totalGunnyOld', 2] },
                totalJuteWeight: { $round: ['$totalJuteWeight', 2] },
                totalTruckWeight: { $round: ['$totalTruckWeight', 2] },
                totalGunnyWeight: { $round: ['$totalGunnyWeight', 2] },
                totalNetWeight: { $round: ['$totalNetWeight', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalGunnyNew: 0,
            totalGunnyOld: 0,
            totalJuteWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updateGovtRiceOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GovtRiceOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Govt rice outward entry not found')
    logger.info('Govt rice outward entry updated', { id, millId })
    return entry
}

export const deleteGovtRiceOutwardEntry = async (millId, id) => {
    const entry = await GovtRiceOutward.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Govt rice outward entry not found')
    logger.info('Govt rice outward entry deleted', { id, millId })
}

export const bulkDeleteGovtRiceOutwardEntries = async (millId, ids) => {
    const result = await GovtRiceOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Govt rice outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
