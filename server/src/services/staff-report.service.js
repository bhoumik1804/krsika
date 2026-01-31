import mongoose from 'mongoose'
import { StaffReport } from '../models/staff-report.model.js'
import logger from '../utils/logger.js'

/**
 * Staff Report Service
 * Business logic for staff report operations
 */

/**
 * Create a new staff report
 */
export const createStaffReportEntry = async (millId, data, userId) => {
    try {
        const staffReport = new StaffReport({
            ...data,
            millId,
            createdBy: userId,
        })

        await staffReport.save()

        logger.info('Staff report created', {
            id: staffReport._id,
            millId,
            userId,
        })

        return staffReport
    } catch (error) {
        logger.error('Failed to create staff report', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff report by ID
 */
export const getStaffReportById = async (millId, id) => {
    try {
        const staffReport = await StaffReport.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!staffReport) {
            const error = new Error('Staff report not found')
            error.statusCode = 404
            throw error
        }

        return staffReport
    } catch (error) {
        logger.error('Failed to get staff report', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff report list with pagination and filters
 */
export const getStaffReportList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'staffName',
            sortOrder = 'asc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            matchStage.$or = [
                { staffName: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = StaffReport.aggregate([
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
    } catch (error) {
        logger.error('Failed to get staff report list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff report summary statistics
 */
export const getStaffReportSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await StaffReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalStaff: { $sum: 1 },
                    totalSalary: { $sum: { $ifNull: ['$salary', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalStaff: 1,
                    totalSalary: 1,
                },
            },
        ])

        return (
            summary || {
                totalStaff: 0,
                totalSalary: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get staff report summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a staff report
 */
export const updateStaffReportEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const staffReport = await StaffReport.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!staffReport) {
            const error = new Error('Staff report not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Staff report updated', {
            id,
            millId,
            userId,
        })

        return staffReport
    } catch (error) {
        logger.error('Failed to update staff report', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a staff report
 */
export const deleteStaffReportEntry = async (millId, id) => {
    try {
        const staffReport = await StaffReport.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!staffReport) {
            const error = new Error('Staff report not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Staff report deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete staff report', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete staff reports
 */
export const bulkDeleteStaffReportEntries = async (millId, ids) => {
    try {
        const result = await StaffReport.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Staff reports bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete staff reports', {
            millId,
            error: error.message,
        })
        throw error
    }
}
