import { Mill } from '../models/mill.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Create a new staff member
 */
export const createStaffEntry = async (millId, data, adminId) => {
    const mill = await Mill.findById(millId)
    if (!mill) {
        throw new ApiError(404, 'Mill not found')
    }

    const existingUser = await User.findOne({ email: data.email.toLowerCase() })
    if (existingUser) {
        throw new ApiError(409, 'A user with this email already exists')
    }

    const staff = new User({
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phoneNumber: data.phoneNumber,
        password: data.password,
        millId,
        role: 'mill-staff',
        isActive: data.isActive !== false,
    })

    await staff.save()

    const staffObj = staff.toObject()
    delete staffObj.password
    delete staffObj.refreshToken

    logger.info('Staff member created', { staffId: staff._id, millId, adminId })
    return staffObj
}

/**
 * Get staff member by ID
 */
export const getStaffById = async (millId, staffId) => {
    const staff = await User.findOne({
        _id: staffId,
        millId,
        role: 'mill-staff',
    }).select('-password -refreshToken')

    if (!staff) {
        throw new ApiError(404, 'Staff member not found')
    }

    return staff.toObject()
}

/**
 * Get all staff members with pagination
 */
export const getStaffList = async (
    millId,
    {
        page = 1,
        limit = 10,
        search = '',
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    }
) => {
    const skip = (page - 1) * limit
    const filter = { millId, role: 'mill-staff' }

    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
        ]
    }

    if (isActive !== undefined) {
        filter.isActive = isActive
    }

    const [data, total] = await Promise.all([
        User.find(filter)
            .select('-password -refreshToken')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
        data: data.map((staff) => staff.toObject()),
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
        },
    }
}

/**
 * Get staff summary statistics
 */
export const getStaffSummary = async (millId) => {
    const [totalStaff, activeStaff, inactiveStaff] = await Promise.all([
        User.countDocuments({ millId, role: 'mill-staff' }),
        User.countDocuments({ millId, role: 'mill-staff', isActive: true }),
        User.countDocuments({ millId, role: 'mill-staff', isActive: false }),
    ])

    return { totalStaff, activeStaff, inactiveStaff }
}

/**
 * Update staff member
 */
export const updateStaffEntry = async (millId, staffId, data, adminId) => {
    const staff = await User.findOne({
        _id: staffId,
        millId,
        role: 'mill-staff',
    })

    if (!staff) {
        throw new ApiError(404, 'Staff member not found')
    }

    if (data.email && data.email.toLowerCase() !== staff.email) {
        const existingUser = await User.findOne({
            email: data.email.toLowerCase(),
        })
        if (existingUser) {
            throw new ApiError(409, 'This email is already in use')
        }
        staff.email = data.email.toLowerCase()
    }

    if (data.fullName) staff.fullName = data.fullName
    if (data.phoneNumber !== undefined) staff.phoneNumber = data.phoneNumber
    if (data.isActive !== undefined) staff.isActive = data.isActive

    await staff.save()

    logger.info('Staff member updated', { staffId, millId, adminId })

    const staffObj = staff.toObject()
    delete staffObj.password
    delete staffObj.refreshToken

    return staffObj
}

/**
 * Delete staff member
 */
export const deleteStaffEntry = async (millId, staffId, adminId) => {
    const staff = await User.findOneAndDelete({
        _id: staffId,
        millId,
        role: 'mill-staff',
    })

    if (!staff) {
        throw new ApiError(404, 'Staff member not found')
    }

    logger.info('Staff member deleted', { staffId, millId, adminId })
    return staff.toObject()
}

/**
 * Bulk delete staff members
 */
export const bulkDeleteStaffEntries = async (millId, ids, adminId) => {
    const result = await User.deleteMany({
        _id: { $in: ids },
        millId,
        role: 'mill-staff',
    })

    logger.info('Staff members bulk deleted', {
        deletedCount: result.deletedCount,
        millId,
        adminId,
    })

    return { deletedCount: result.deletedCount }
}
