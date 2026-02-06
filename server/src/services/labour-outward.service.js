import mongoose from 'mongoose'
import { LabourOutward } from '../models/labour-outward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createLabourOutwardEntry = async (millId, data, userId) => {
    const entry = new LabourOutward({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Labour outward entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getLabourOutwardById = async (millId, id) => {
    const entry = await LabourOutward.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Labour outward entry not found')
    return entry
}

export const getLabourOutwardList = async (millId, options = {}) => {
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

    const aggregate = LabourOutward.aggregate([
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
    const result = await LabourOutward.aggregatePaginate(aggregate, {
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

export const getLabourOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await LabourOutward.aggregate([
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

export const updateLabourOutwardEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await LabourOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Labour outward entry not found')
    logger.info('Labour outward entry updated', { id, millId, userId })
    return entry
}

export const deleteLabourOutwardEntry = async (millId, id) => {
    const entry = await LabourOutward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Labour outward entry not found')
    logger.info('Labour outward entry deleted', { id, millId })
}

export const bulkDeleteLabourOutwardEntries = async (millId, ids) => {
    const result = await LabourOutward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Labour outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
