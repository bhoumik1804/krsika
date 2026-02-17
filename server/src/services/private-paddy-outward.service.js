import mongoose from 'mongoose'
import { PrivatePaddyOutward } from '../models/private-paddy-outward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createPrivatePaddyOutwardEntry = async (millId, data, userId) => {
    const entry = new PrivatePaddyOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Private paddy outward entry created', {
        id: entry._id,
        millId,
    })

    // Record stock transaction (DEBIT - outgoing paddy)
    try {
        const qty = entry.netWeight || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Paddy',
            variety: entry.paddyType || null,
            type: 'DEBIT',
            action: 'Outward',
            quantity: qty / 100,
            bags: (entry.gunnyNew || 0) + (entry.gunnyOld || 0) + (entry.gunnyPlastic || 0),
            refModel: 'PrivatePaddyOutward',
            refId: entry._id,
            remarks: `Private Paddy Outward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for private paddy outward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getPrivatePaddyOutwardById = async (millId, id) => {
    const entry = await PrivatePaddyOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Private paddy outward entry not found')
    return entry
}

export const getPrivatePaddyOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        paddyType,
        partyName,
        brokerName,
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
    if (paddyType) matchStage.paddyType = { $regex: escapeRegex(paddyType), $options: 'i' }
    if (partyName) matchStage.partyName = { $regex: escapeRegex(partyName), $options: 'i' }
    if (brokerName) matchStage.brokerName = { $regex: escapeRegex(brokerName), $options: 'i' }
    
    // Search across multiple fields
    if (search)
        matchStage.$or = [
            { partyName: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNumber: { $regex: escapeRegex(search), $options: 'i' } },
            { paddyType: { $regex: escapeRegex(search), $options: 'i' } },
            { paddySaleDealNumber: { $regex: escapeRegex(search), $options: 'i' } },
            { rstNumber: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = PrivatePaddyOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await PrivatePaddyOutward.aggregatePaginate(aggregate, {
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

export const getPrivatePaddyOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await PrivatePaddyOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalPaddyQty: { $sum: '$doQty' },
                totalGunnyNew: { $sum: '$gunnyNew' },
                totalGunnyOld: { $sum: '$gunnyOld' },
                totalGunnyPlastic: { $sum: '$gunnyPlastic' },
                totalJuteWeight: { $sum: '$juteWeight' },
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
                totalPaddyQty: { $round: ['$totalPaddyQty', 2] },
                totalGunnyNew: { $round: ['$totalGunnyNew', 2] },
                totalGunnyOld: { $round: ['$totalGunnyOld', 2] },
                totalGunnyPlastic: { $round: ['$totalGunnyPlastic', 2] },
                totalJuteWeight: { $round: ['$totalJuteWeight', 2] },
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
            totalPaddyQty: 0,
            totalGunnyNew: 0,
            totalGunnyOld: 0,
            totalGunnyPlastic: 0,
            totalJuteWeight: 0,
            totalPlasticWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updatePrivatePaddyOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await PrivatePaddyOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Private paddy outward entry not found')
    logger.info('Private paddy outward entry updated', { id, millId })
    return entry
}

export const deletePrivatePaddyOutwardEntry = async (millId, id) => {
    const entry = await PrivatePaddyOutward.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Private paddy outward entry not found')
    logger.info('Private paddy outward entry deleted', { id, millId })
}

export const bulkDeletePrivatePaddyOutwardEntries = async (millId, ids) => {
    const result = await PrivatePaddyOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Private paddy outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
