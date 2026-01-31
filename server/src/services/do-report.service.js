import mongoose from 'mongoose'
import { DoReport } from '../models/do-report.model.js'
import logger from '../utils/logger.js'

/**
 * DO Report Service
 * Business logic for DO report operations
 */

/**
 * Create a new DO report
 */
export const createDoReportEntry = async (millId, data, userId) => {
    try {
        const doReport = new DoReport({
            ...data,
            millId,
            createdBy: userId,
        })

        await doReport.save()

        logger.info('DO report created', {
            id: doReport._id,
            millId,
            userId,
        })

        return doReport
    } catch (error) {
        logger.error('Failed to create DO report', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get DO report by ID
 */
export const getDoReportById = async (millId, id) => {
    try {
        const doReport = await DoReport.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!doReport) {
            const error = new Error('DO report not found')
            error.statusCode = 404
            throw error
        }

        return doReport
    } catch (error) {
        logger.error('Failed to get DO report', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get DO report list with pagination and filters
 */
export const getDoReportList = async (millId, options = {}) => {
    try {
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
                { doNumber: { $regex: search, $options: 'i' } },
                { partyName: { $regex: search, $options: 'i' } },
                { itemType: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = DoReport.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
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
    } catch (error) {
        logger.error('Failed to get DO report list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get DO report summary statistics
 */
export const getDoReportSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await DoReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalDoReports: { $sum: 1 },
                    totalQuantity: { $sum: { $ifNull: ['$quantity', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalDoReports: 1,
                    totalQuantity: 1,
                },
            },
        ])

        return (
            summary || {
                totalDoReports: 0,
                totalQuantity: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get DO report summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a DO report
 */
export const updateDoReportEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const doReport = await DoReport.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!doReport) {
            const error = new Error('DO report not found')
            error.statusCode = 404
            throw error
        }

        logger.info('DO report updated', {
            id,
            millId,
            userId,
        })

        return doReport
    } catch (error) {
        logger.error('Failed to update DO report', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a DO report
 */
export const deleteDoReportEntry = async (millId, id) => {
    try {
        const doReport = await DoReport.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!doReport) {
            const error = new Error('DO report not found')
            error.statusCode = 404
            throw error
        }

        logger.info('DO report deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete DO report', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete DO reports
 */
export const bulkDeleteDoReportEntries = async (millId, ids) => {
    try {
        const result = await DoReport.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('DO reports bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete DO reports', {
            millId,
            error: error.message,
        })
        throw error
    }
}
