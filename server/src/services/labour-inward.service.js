import mongoose from 'mongoose'
import { LabourInward } from '../models/labour-inward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createLabourInwardEntry = async (millId, data, userId) => {
    const entry = new LabourInward({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Labour inward entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getLabourInwardById = async (millId, id) => {
    const entry = await LabourInward.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Labour inward entry not found')
    return entry
}

export const getLabourInwardList = async (millId, options = {}) => {
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
            { labourName: { $regex: search, $options: 'i' } },
            { groupName: { $regex: search, $options: 'i' } },
        ]

    const aggregate = LabourInward.aggregate([
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
    const result = await LabourInward.aggregatePaginate(aggregate, {
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

export const getLabourInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await LabourInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalAmount: { $round: ['$totalAmount', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalAmount: 0 }
}

export const updateLabourInwardEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await LabourInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Labour inward entry not found')
    logger.info('Labour inward entry updated', { id, millId, userId })
    return entry
}

export const deleteLabourInwardEntry = async (millId, id) => {
    const entry = await LabourInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Labour inward entry not found')
    logger.info('Labour inward entry deleted', { id, millId })
}

export const bulkDeleteLabourInwardEntries = async (millId, ids) => {
    const result = await LabourInward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Labour inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
