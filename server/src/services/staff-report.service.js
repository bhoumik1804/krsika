import mongoose from 'mongoose'
import { StaffReport } from '../models/staff-report.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createStaffReportEntry = async (millId, data, userId) => {
    const entry = new StaffReport({ ...data, millId, createdBy: userId })
    await entry.save()
    logger.info('Staff report entry created', { id: entry._id, millId, userId })
    return entry
}

export const getStaffReportById = async (millId, id) => {
    const entry = await StaffReport.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Staff report entry not found')
    return entry
}

export const getStaffReportList = async (millId, options = {}) => {
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
            { staffName: { $regex: search, $options: 'i' } },
            { reportType: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = StaffReport.aggregate([
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

    const result = await StaffReport.aggregatePaginate(aggregate, {
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

export const getStaffReportSummary = async (millId) => {
    const [summary] = await StaffReport.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalEntries: { $sum: 1 } } },
        { $project: { _id: 0, totalEntries: 1 } },
    ])
    return summary || { totalEntries: 0 }
}

export const updateStaffReportEntry = async (millId, id, data, userId) => {
    const entry = await StaffReport.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Staff report entry not found')
    logger.info('Staff report entry updated', { id, millId, userId })
    return entry
}

export const deleteStaffReportEntry = async (millId, id) => {
    const entry = await StaffReport.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Staff report entry not found')
    logger.info('Staff report entry deleted', { id, millId })
}

export const bulkDeleteStaffReportEntries = async (millId, ids) => {
    const result = await StaffReport.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Staff report entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
