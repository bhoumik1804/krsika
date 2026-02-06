import mongoose from 'mongoose'
import { FrkInward } from '../models/frk-inward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createFrkInwardEntry = async (millId, data, userId) => {
    const entry = new FrkInward({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('FRK inward entry created', { id: entry._id, millId, userId })
    return entry
}

export const getFrkInwardById = async (millId, id) => {
    const entry = await FrkInward.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
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
            { vehicleNumber: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = FrkInward.aggregate([
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
    const match = { millId }
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

export const updateFrkInwardEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await FrkInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'FRK inward entry not found')
    logger.info('FRK inward entry updated', { id, millId, userId })
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
