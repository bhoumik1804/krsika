import mongoose from 'mongoose'
import { DoReport } from '../models/do-report.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createDoReportEntry = async (millId, data, userId) => {
    const entry = new DoReport({ ...data, millId, createdBy: userId })
    await entry.save()
    logger.info('DO report entry created', { id: entry._id, millId, userId })
    return entry
}

export const getDoReportById = async (millId, id) => {
    const entry = await DoReport.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'DO report entry not found')
    return entry
}

export const getDoReportList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { doNumber: { $regex: search, $options: 'i' } },
            { partyName: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DoReport.aggregate([
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

    const result = await DoReport.aggregatePaginate(aggregate, {
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

export const getDoReportSummary = async (millId) => {
    const [summary] = await DoReport.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
            },
        },
        { $project: { _id: 0, totalEntries: 1, totalQuantity: 1 } },
    ])
    return summary || { totalEntries: 0, totalQuantity: 0 }
}

export const updateDoReportEntry = async (millId, id, data, userId) => {
    const entry = await DoReport.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'DO report entry not found')
    logger.info('DO report entry updated', { id, millId, userId })
    return entry
}

export const deleteDoReportEntry = async (millId, id) => {
    const entry = await DoReport.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'DO report entry not found')
    logger.info('DO report entry deleted', { id, millId })
}

export const bulkDeleteDoReportEntries = async (millId, ids) => {
    const result = await DoReport.deleteMany({ _id: { $in: ids }, millId })
    logger.info('DO report entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
