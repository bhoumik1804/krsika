import mongoose from 'mongoose'
import { MillingRice } from '../models/milling-rice.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createMillingRiceEntry = async (millId, data, userId) => {
    const entry = new MillingRice({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Milling rice entry created', { id: entry._id, millId, userId })
    return entry
}

export const getMillingRiceById = async (millId, id) => {
    const entry = await MillingRice.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Milling rice entry not found')
    return entry
}

export const getMillingRiceList = async (millId, options = {}) => {
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
        matchStage.$or = [{ riceType: { $regex: search, $options: 'i' } }]

    const aggregate = MillingRice.aggregate([
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
    const result = await MillingRice.aggregatePaginate(aggregate, {
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

export const getMillingRiceSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await MillingRice.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalInput: { $sum: '$inputWeight' },
                totalOutput: { $sum: '$outputWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalInput: { $round: ['$totalInput', 2] },
                totalOutput: { $round: ['$totalOutput', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalInput: 0, totalOutput: 0 }
}

export const updateMillingRiceEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await MillingRice.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Milling rice entry not found')
    logger.info('Milling rice entry updated', { id, millId, userId })
    return entry
}

export const deleteMillingRiceEntry = async (millId, id) => {
    const entry = await MillingRice.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Milling rice entry not found')
    logger.info('Milling rice entry deleted', { id, millId })
}

export const bulkDeleteMillingRiceEntries = async (millId, ids) => {
    const result = await MillingRice.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Milling rice entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
