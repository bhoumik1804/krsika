import mongoose from 'mongoose'
import { GunnyInward } from '../models/gunny-inward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createGunnyInwardEntry = async (millId, data, userId) => {
    const entry = new GunnyInward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Gunny inward entry created', { id: entry._id, millId })

    // Record stock transaction (CREDIT - incoming gunny bags)
    try {
        const totalBags = (entry.gunnyNew || 0) + (entry.gunnyOld || 0) + (entry.gunnyPlastic || 0)
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Gunny',
            variety: null,
            type: 'CREDIT',
            action: 'Inward',
            quantity: totalBags, // Gunny tracked by count
            bags: totalBags,
            refModel: 'GunnyInward',
            refId: entry._id,
            remarks: `Gunny Inward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for gunny inward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getGunnyInwardById = async (millId, id) => {
    const entry = await GunnyInward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny inward entry not found')
    return entry
}

export const getGunnyInwardList = async (millId, options = {}) => {
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
    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { gunnyPurchaseDealNumber: { $regex: search, $options: 'i' } },
            { delivery: { $regex: search, $options: 'i' } },
            { samitiSangrahan: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = GunnyInward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])

    const result = await GunnyInward.aggregatePaginate(aggregate, {
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

export const getGunnyInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await GunnyInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalGunnyNew: { $sum: '$gunnyNew' },
                totalGunnyOld: { $sum: '$gunnyOld' },
                totalGunnyPlastic: { $sum: '$gunnyPlastic' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalGunnyNew: 1,
                totalGunnyOld: 1,
                totalGunnyPlastic: 1,
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalGunnyNew: 0,
            totalGunnyOld: 0,
            totalGunnyPlastic: 0,
        }
    )
}

export const updateGunnyInwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GunnyInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Gunny inward entry not found')
    logger.info('Gunny inward entry updated', { id, millId })
    return entry
}

export const deleteGunnyInwardEntry = async (millId, id) => {
    const entry = await GunnyInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny inward entry not found')
    logger.info('Gunny inward entry deleted', { id, millId })
}

export const bulkDeleteGunnyInwardEntries = async (millId, ids) => {
    const result = await GunnyInward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Gunny inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
