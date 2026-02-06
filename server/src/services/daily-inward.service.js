import mongoose from 'mongoose'
import { DailyInward } from '../models/daily-inward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createDailyInwardEntry = async (millId, data, userId) => {
    const dailyInward = new DailyInward({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })

    await dailyInward.save()
    logger.info('Daily inward entry created', {
        id: dailyInward._id,
        millId,
        userId,
    })
    return dailyInward
}

export const getDailyInwardById = async (millId, id) => {
    const dailyInward = await DailyInward.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!dailyInward) throw new ApiError(404, 'Daily inward entry not found')
    return dailyInward
}

export const getDailyInwardList = async (millId, options = {}) => {
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
            { driverName: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DailyInward.aggregate([
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

    const result = await DailyInward.aggregatePaginate(aggregate, {
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

export const getDailyInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }

    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailyInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalBags: { $sum: '$bags' },
                totalWeight: { $sum: '$weight' },
                pendingCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                },
                completedCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                },
                verifiedCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'verified'] }, 1, 0] },
                },
                rejectedCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalBags: 1,
                totalWeight: { $round: ['$totalWeight', 2] },
                statusCounts: {
                    pending: '$pendingCount',
                    completed: '$completedCount',
                    verified: '$verifiedCount',
                    rejected: '$rejectedCount',
                },
            },
        },
    ])

    return (
        summary || {
            totalEntries: 0,
            totalBags: 0,
            totalWeight: 0,
            statusCounts: {
                pending: 0,
                completed: 0,
                verified: 0,
                rejected: 0,
            },
        }
    )
}

export const updateDailyInwardEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const dailyInward = await DailyInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!dailyInward) throw new ApiError(404, 'Daily inward entry not found')
    logger.info('Daily inward entry updated', { id, millId, userId })
    return dailyInward
}

export const deleteDailyInwardEntry = async (millId, id) => {
    const dailyInward = await DailyInward.findOneAndDelete({ _id: id, millId })
    if (!dailyInward) throw new ApiError(404, 'Daily inward entry not found')
    logger.info('Daily inward entry deleted', { id, millId })
}

export const bulkDeleteDailyInwardEntries = async (millId, ids) => {
    const result = await DailyInward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Daily inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
