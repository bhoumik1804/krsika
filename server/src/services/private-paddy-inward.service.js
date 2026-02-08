import mongoose from 'mongoose'
import { PrivatePaddyInward } from '../models/private-paddy-inward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createPrivatePaddyInwardEntry = async (millId, data) => {
    const entry = new PrivatePaddyInward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Private paddy inward entry created', {
        id: entry._id,
        millId,
    })
    return entry
}

export const getPrivatePaddyInwardById = async (millId, id) => {
    const entry = await PrivatePaddyInward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Private paddy inward entry not found')
    return entry
}

export const getPrivatePaddyInwardList = async (millId, options = {}) => {
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
            { truckNumber: { $regex: search, $options: 'i' } },
            { paddyPurchaseDealNumber: { $regex: search, $options: 'i' } },
            { rstNumber: { $regex: search, $options: 'i' } },
            { doNumber: { $regex: search, $options: 'i' } },
        ]

    const aggregate = PrivatePaddyInward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await PrivatePaddyInward.aggregatePaginate(aggregate, {
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

export const getPrivatePaddyInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await PrivatePaddyInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalMota: { $sum: '$paddyMota' },
                totalPatla: { $sum: '$paddyPatla' },
                totalSarna: { $sum: '$paddySarna' },
                totalMahamaya: { $sum: '$paddyMahamaya' },
                totalRbGold: { $sum: '$paddyRbGold' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalMota: { $round: ['$totalMota', 2] },
                totalPatla: { $round: ['$totalPatla', 2] },
                totalSarna: { $round: ['$totalSarna', 2] },
                totalMahamaya: { $round: ['$totalMahamaya', 2] },
                totalRbGold: { $round: ['$totalRbGold', 2] },
                totalWeight: {
                    $round: [
                        {
                            $add: [
                                '$totalMota',
                                '$totalPatla',
                                '$totalSarna',
                                '$totalMahamaya',
                                '$totalRbGold',
                            ],
                        },
                        2,
                    ],
                },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalMota: 0,
            totalPatla: 0,
            totalSarna: 0,
            totalMahamaya: 0,
            totalRbGold: 0,
            totalWeight: 0,
        }
    )
}

export const updatePrivatePaddyInwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await PrivatePaddyInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Private paddy inward entry not found')
    logger.info('Private paddy inward entry updated', { id, millId })
    return entry
}

export const deletePrivatePaddyInwardEntry = async (millId, id) => {
    const entry = await PrivatePaddyInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Private paddy inward entry not found')
    logger.info('Private paddy inward entry deleted', { id, millId })
}

export const bulkDeletePrivatePaddyInwardEntries = async (millId, ids) => {
    const result = await PrivatePaddyInward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Private paddy inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
