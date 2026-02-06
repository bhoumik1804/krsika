import mongoose from 'mongoose'
import { DailyMilling } from '../models/daily-milling.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createDailyMillingEntry = async (millId, data, userId) => {
    const entry = new DailyMilling({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Daily milling entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getDailyMillingById = async (millId, id) => {
    const entry = await DailyMilling.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily milling entry not found')
    return entry
}

export const getDailyMillingList = async (millId, options = {}) => {
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
            { millingType: { $regex: search, $options: 'i' } },
            { notes: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DailyMilling.aggregate([
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

    const result = await DailyMilling.aggregatePaginate(aggregate, {
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

export const getDailyMillingSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailyMilling.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalInputWeight: { $sum: '$inputWeight' },
                totalOutputWeight: { $sum: '$outputWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalInputWeight: { $round: ['$totalInputWeight', 2] },
                totalOutputWeight: { $round: ['$totalOutputWeight', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalInputWeight: 0,
            totalOutputWeight: 0,
        }
    )
}

export const updateDailyMillingEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await DailyMilling.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily milling entry not found')
    logger.info('Daily milling entry updated', { id, millId, userId })
    return entry
}

export const deleteDailyMillingEntry = async (millId, id) => {
    const entry = await DailyMilling.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Daily milling entry not found')
    logger.info('Daily milling entry deleted', { id, millId })
}

export const bulkDeleteDailyMillingEntries = async (millId, ids) => {
    const result = await DailyMilling.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Daily milling entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
