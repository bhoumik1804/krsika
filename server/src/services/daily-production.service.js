import mongoose from 'mongoose'
import { DailyProduction } from '../models/daily-production.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createDailyProductionEntry = async (millId, data, userId) => {
    const entry = new DailyProduction({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Daily production entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getDailyProductionById = async (millId, id) => {
    const entry = await DailyProduction.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily production entry not found')
    return entry
}

export const getDailyProductionList = async (millId, options = {}) => {
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
            { productType: { $regex: search, $options: 'i' } },
            { notes: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DailyProduction.aggregate([
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

    const result = await DailyProduction.aggregatePaginate(aggregate, {
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

export const getDailyProductionSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailyProduction.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                totalWeight: { $sum: '$weight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalQuantity: 1,
                totalWeight: { $round: ['$totalWeight', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalQuantity: 0, totalWeight: 0 }
}

export const updateDailyProductionEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await DailyProduction.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily production entry not found')
    logger.info('Daily production entry updated', { id, millId, userId })
    return entry
}

export const deleteDailyProductionEntry = async (millId, id) => {
    const entry = await DailyProduction.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Daily production entry not found')
    logger.info('Daily production entry deleted', { id, millId })
}

export const bulkDeleteDailyProductionEntries = async (millId, ids) => {
    const result = await DailyProduction.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Daily production entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
