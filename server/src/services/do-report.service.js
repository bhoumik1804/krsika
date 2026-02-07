import mongoose from 'mongoose'
import { DoReport } from '../models/do-report.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createDoReportEntry = async (millId, data) => {
    const entry = new DoReport({ ...data, millId })
    await entry.save()
    logger.info('DO report entry created', { id: entry._id, millId })
    return entry
}

export const bulkCreateDoReportEntries = async (millId, reports) => {
    const reportData = reports.map((r) => ({
        ...r,
        millId,
    }))
    const result = await DoReport.insertMany(reportData)
    logger.info('DO report entries bulk created', {
        millId,
        count: result.length,
    })
    return result
}

export const getDoReportById = async (millId, id) => {
    const entry = await DoReport.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'DO report entry not found')
    return entry
}

export const getDoReportList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { samitiSangrahan: { $regex: search, $options: 'i' } },
            { doNo: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DoReport.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
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
                totalDhanMota: { $sum: '$dhanMota' },
                totalDhanPatla: { $sum: '$dhanPatla' },
                totalDhanSarna: { $sum: '$dhanSarna' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalDhanMota: 1,
                totalDhanPatla: 1,
                totalDhanSarna: 1,
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalDhanMota: 0,
            totalDhanPatla: 0,
            totalDhanSarna: 0,
        }
    )
}

export const updateDoReportEntry = async (millId, id, data) => {
    const entry = await DoReport.findOneAndUpdate(
        { _id: id, millId },
        { ...data },
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'DO report entry not found')
    logger.info('DO report entry updated', { id, millId })
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
