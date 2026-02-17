import mongoose from 'mongoose'
import { SilkyKodhaOutward } from '../models/silky-kodha-outward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createSilkyKodhaOutwardEntry = async (millId, data, userId) => {
    const entry = new SilkyKodhaOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Silky kodha outward entry created', {
        id: entry._id,
        millId,
    })

    // Record stock transaction (DEBIT - outgoing silky kodha)
    try {
        const qty = entry.netWeight || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Silky Kodha',
            variety: null,
            type: 'DEBIT',
            action: 'Outward',
            quantity: qty / 100,
            bags: entry.gunnyPlastic || 0,
            refModel: 'SilkyKodhaOutward',
            refId: entry._id,
            remarks: `Silky Kodha Outward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for silky kodha outward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getSilkyKodhaOutwardById = async (millId, id) => {
    const entry = await SilkyKodhaOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Silky kodha outward entry not found')
    return entry
}

export const getSilkyKodhaOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
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
    if (partyName)
        matchStage.partyName = { $regex: escapeRegex(partyName), $options: 'i' }
    if (brokerName)
        matchStage.brokerName = {
            $regex: escapeRegex(brokerName),
            $options: 'i',
        }

    if (search)
        matchStage.$or = [
            { partyName: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
            {
                silkyKodhaSaleDealNumber: {
                    $regex: escapeRegex(search),
                    $options: 'i',
                },
            },
            { truckRst: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = SilkyKodhaOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await SilkyKodhaOutward.aggregatePaginate(aggregate, {
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

export const getSilkyKodhaOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const result = await SilkyKodhaOutward.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalGunnyPlastic: { $sum: { $ifNull: ['$gunnyPlastic', 0] } },
                totalPlasticWeight: {
                    $sum: { $ifNull: ['$plasticWeight', 0] },
                },
                totalTruckWeight: { $sum: { $ifNull: ['$truckWeight', 0] } },
                totalGunnyWeight: { $sum: { $ifNull: ['$gunnyWeight', 0] } },
                totalNetWeight: { $sum: { $ifNull: ['$netWeight', 0] } },
            },
        },
    ])

    return (
        result[0] || {
            totalEntries: 0,
            totalGunnyPlastic: 0,
            totalPlasticWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updateSilkyKodhaOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await SilkyKodhaOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Silky kodha outward entry not found')
    logger.info('Silky kodha outward entry updated', { id, millId })
    return entry
}

export const deleteSilkyKodhaOutwardEntry = async (millId, id) => {
    const entry = await SilkyKodhaOutward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Silky kodha outward entry not found')
    logger.info('Silky kodha outward entry deleted', { id, millId })
    return entry
}

export const bulkDeleteSilkyKodhaOutwardEntries = async (millId, ids) => {
    const result = await SilkyKodhaOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Silky kodha outward entries bulk deleted', {
        count: result.deletedCount,
        millId,
    })
    return { deletedCount: result.deletedCount }
}
