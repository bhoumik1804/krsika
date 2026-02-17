import mongoose from 'mongoose'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createStaffReportEntry = async (millId, data) => {
    const user = new User({
        ...data,
        millId,
        role: ROLES.MILL_STAFF,
    })
    await user.save()
    logger.info('Staff created', { id: user._id, millId })
    return user
}

export const getStaffReportById = async (millId, id) => {
    const user = await User.findOne({
        _id: id,
        millId,
        role: ROLES.MILL_STAFF,
    })
    if (!user) throw new ApiError(404, 'Staff not found')
    return user
}

export const getStaffReportList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'fullName',
        sortOrder = 'asc',
    } = options
    const matchStage = {
        millId: new mongoose.Types.ObjectId(millId),
        role: ROLES.MILL_STAFF,
    }

    if (search) {
        matchStage.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { post: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = User.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
        {
            $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                phoneNumber: 1,
                post: 1,
                salary: 1,
                millId: 1,
                role: 1,
                address: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ])

    const result = await User.aggregatePaginate(aggregate, {
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
    const [summary] = await User.aggregate([
        {
            $match: {
                millId: new mongoose.Types.ObjectId(millId),
                role: ROLES.MILL_STAFF,
            },
        },
        {
            $group: {
                _id: null,
                totalStaff: { $sum: 1 },
                totalSalary: { $sum: '$salary' },
            },
        },
        { $project: { _id: 0, totalStaff: 1, totalSalary: 1 } },
    ])
    return summary || { totalStaff: 0, totalSalary: 0 }
}

export const updateStaffReportEntry = async (millId, id, data) => {
    const user = await User.findOneAndUpdate(
        { _id: id, millId, role: ROLES.MILL_STAFF },
        { ...data },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -permissions -attendanceHistory')
    if (!user) throw new ApiError(404, 'Staff not found')
    logger.info('Staff updated', { id, millId })
    return user
}

export const deleteStaffReportEntry = async (millId, id) => {
    const user = await User.findOneAndDelete({
        _id: id,
        millId,
        role: ROLES.MILL_STAFF,
    })
    if (!user) throw new ApiError(404, 'Staff not found')
    logger.info('Staff deleted', { id, millId })
}

export const bulkDeleteStaffReportEntries = async (millId, ids) => {
    const result = await User.deleteMany({
        _id: { $in: ids },
        millId,
        role: ROLES.MILL_STAFF,
    })
    logger.info('Staff bulk deleted', { millId, count: result.deletedCount })
    return result.deletedCount
}
