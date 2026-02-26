import mongoose from 'mongoose'
import { DailyOutward } from '../models/daily-outward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockHelpers from './stock-helpers.service.js'

export const createDailyOutwardEntry = async (millId, data, userId) => {
    const entry = new DailyOutward({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction
    await StockHelpers.recordOutwardTransaction(millId, entry, userId)

    logger.info('Daily outward entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getDailyOutwardById = async (millId, id) => {
    const entry = await DailyOutward.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily outward entry not found')
    return entry
}

export const getDailyOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        status,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (status) matchStage.status = status
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { vehicleNumber: { $regex: search, $options: 'i' } },
            { gatePassNumber: { $regex: search, $options: 'i' } },
            { item: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DailyOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdByUser',
                pipeline: [{ $project: { fullName: 1, email: 1 } }],
            },
        },
        {
            $unwind: {
                path: '$createdByUser',
                preserveNullAndEmptyArrays: true,
            },
        },
    ])

    const result = await DailyOutward.aggregatePaginate(aggregate, {
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

export const getDailyOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailyOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalBags: { $sum: '$bags' },
                totalWeight: { $sum: '$weight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalBags: 1,
                totalWeight: { $round: ['$totalWeight', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalBags: 0, totalWeight: 0 }
}

export const updateDailyOutwardEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await DailyOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily outward entry not found')

    // Update stock transaction
    if (data.item || data.weight || data.date) {
        await StockHelpers.updateStockTransaction('DailyOutward', id, entry)
    }

    logger.info('Daily outward entry updated', { id, millId, userId })
    return entry
}

export const deleteDailyOutwardEntry = async (millId, id) => {
    const entry = await DailyOutward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Daily outward entry not found')

    // Delete stock transaction
    await StockHelpers.deleteStockTransaction('DailyOutward', id)

    logger.info('Daily outward entry deleted', { id, millId })
}

export const bulkDeleteDailyOutwardEntries = async (millId, ids) => {
    const result = await DailyOutward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Daily outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
