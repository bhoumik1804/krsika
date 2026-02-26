import mongoose from 'mongoose'
import { OtherOutward } from '../models/other-outward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createOtherOutwardEntry = async (millId, data, userId) => {
    const entry = new OtherOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Other outward entry created', { id: entry._id, millId })

    // Record stock transaction (DEBIT - outgoing other items)
    try {
        const qty = entry.netWeight || entry.quantity || 0
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: entry.itemName,
            variety: null,
            type: 'DEBIT',
            action: 'Outward',
            quantity: (entry.netWeight ? entry.netWeight / 100 : entry.quantity) || 0,
            bags: (entry.gunnyNew || 0) + (entry.gunnyOld || 0) + (entry.gunnyPlastic || 0),
            refModel: 'OtherOutward',
            refId: entry._id,
            remarks: `Other Outward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for other outward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getOtherOutwardById = async (millId, id) => {
    const entry = await OtherOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other outward entry not found')
    return entry
}

export const getOtherOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        partyName,
        brokerName,
        itemName,
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
    if (itemName)
        matchStage.itemName = { $regex: escapeRegex(itemName), $options: 'i' }

    if (search)
        matchStage.$or = [
            { partyName: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
            { itemName: { $regex: escapeRegex(search), $options: 'i' } },
            {
                otherSaleDealNumber: {
                    $regex: escapeRegex(search),
                    $options: 'i',
                },
            },
            { truckRst: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = OtherOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await OtherOutward.aggregatePaginate(aggregate, {
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

export const getOtherOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const result = await OtherOutward.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalQuantity: { $sum: { $ifNull: ['$quantity', 0] } },
                totalGunnyNew: { $sum: { $ifNull: ['$gunnyNew', 0] } },
                totalGunnyOld: { $sum: { $ifNull: ['$gunnyOld', 0] } },
                totalGunnyPlastic: { $sum: { $ifNull: ['$gunnyPlastic', 0] } },
                totalJuteGunnyWeight: {
                    $sum: { $ifNull: ['$juteGunnyWeight', 0] },
                },
                totalPlasticGunnyWeight: {
                    $sum: { $ifNull: ['$plasticGunnyWeight', 0] },
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
            totalQuantity: 0,
            totalGunnyNew: 0,
            totalGunnyOld: 0,
            totalGunnyPlastic: 0,
            totalJuteGunnyWeight: 0,
            totalPlasticGunnyWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updateOtherOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await OtherOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Other outward entry not found')
    logger.info('Other outward entry updated', { id, millId })
    return entry
}

export const deleteOtherOutwardEntry = async (millId, id) => {
    const entry = await OtherOutward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Other outward entry not found')
    logger.info('Other outward entry deleted', { id, millId })
    return entry
}

export const bulkDeleteOtherOutwardEntries = async (millId, ids) => {
    const result = await OtherOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Other outward entries bulk deleted', {
        count: result.deletedCount,
        millId,
    })
    return { deletedCount: result.deletedCount }
}
