import mongoose from 'mongoose'
import { FrkInward } from '../models/frk-inward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createFrkInwardEntry = async (millId, data) => {
    const entry = new FrkInward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('FRK inward entry created', { id: entry._id, millId })
    return entry
}

export const getFrkInwardById = async (millId, id) => {
    const entry = await FrkInward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK inward entry not found')
    return entry
}

export const getFrkInwardList = async (millId, options = {}) => {
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
            { purchaseDealId: { $regex: search, $options: 'i' } },
            { truckNumber: { $regex: search, $options: 'i' } },
            { rstNumber: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = FrkInward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])

    const result = await FrkInward.aggregatePaginate(aggregate, {
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

export const getFrkInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await FrkInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalNetWeight: { $sum: '$netWeight' },
                totalTruckWeight: { $sum: '$truckWeight' },
                totalGunnyWeight: { $sum: '$gunnyWeight' },
                totalPlasticWeight: { $sum: '$plasticWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalNetWeight: { $round: ['$totalNetWeight', 2] },
                totalTruckWeight: { $round: ['$totalTruckWeight', 2] },
                totalGunnyWeight: { $round: ['$totalGunnyWeight', 2] },
                totalPlasticWeight: { $round: ['$totalPlasticWeight', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalNetWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalPlasticWeight: 0,
        }
    )
}

export const updateFrkInwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await FrkInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'FRK inward entry not found')
    logger.info('FRK inward entry updated', { id, millId })
    return entry
}

export const deleteFrkInwardEntry = async (millId, id) => {
    const entry = await FrkInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'FRK inward entry not found')
    logger.info('FRK inward entry deleted', { id, millId })
}

export const bulkDeleteFrkInwardEntries = async (millId, ids) => {
    const result = await FrkInward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('FRK inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
