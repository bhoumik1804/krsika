import mongoose from 'mongoose'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Create a new user
 */
export const createUserEntry = async (data, adminId) => {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() })
    if (existingUser)
        throw new ApiError(409, 'A user with this email already exists')

    const user = new User({ ...data, email: data.email.toLowerCase() })
    await user.save()

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    logger.info('User created', { id: user._id, adminId })
    return userObj
}

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
    const user = await User.findById(id)
        .select('-password -refreshToken')
        .populate('millId', 'millName status')
    if (!user) throw new ApiError(404, 'User not found')
    return user
}

/**
 * Get users list with pagination and filters
 */
export const getUsersList = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        role,
        isActive,
        millId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = options

    const matchStage = {}
    if (role) matchStage.role = role
    if (typeof isActive === 'boolean') matchStage.isActive = isActive
    if (millId) matchStage.millId = new mongoose.Types.ObjectId(millId)
    if (search)
        matchStage.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ]

    const sortStage = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const aggregate = User.aggregate([
        { $match: matchStage },
        { $sort: sortStage },
        {
            $lookup: {
                from: 'mills',
                localField: 'millId',
                foreignField: '_id',
                as: 'millDetails',
                pipeline: [{ $project: { millName: 1, status: 1 } }],
            },
        },
        { $unwind: { path: '$millDetails', preserveNullAndEmptyArrays: true } },
        { $addFields: { millId: { $ifNull: ['$millDetails', null] } } },
        { $project: { password: 0, refreshToken: 0, millDetails: 0 } },
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

/**
 * Get users summary statistics
 */
export const getUsersSummary = async () => {
    const [roleCounts, statusCounts, recentUsers, totalUsers] =
        await Promise.all([
            User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
            User.aggregate([
                { $group: { _id: '$isActive', count: { $sum: 1 } } },
            ]),
            User.find()
                .select('-password -refreshToken')
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('millId', 'millName status'),
            User.countDocuments(),
        ])

    const roleCountsObj = {
        'super-admin': 0,
        'mill-admin': 0,
        'mill-staff': 0,
        'guest-user': 0,
    }
    roleCounts.forEach((item) => {
        roleCountsObj[item._id] = item.count
    })

    const statusCountsObj = { active: 0, inactive: 0, suspended: 0 }
    statusCounts.forEach((item) => {
        item._id === true
            ? (statusCountsObj.active = item.count)
            : (statusCountsObj.inactive = item.count)
    })

    return {
        totalUsers,
        roleCounts: roleCountsObj,
        statusCounts: statusCountsObj,
        recentUsers,
    }
}

/**
 * Update a user
 */
export const updateUserEntry = async (id, data, adminId) => {
    const user = await User.findById(id)
    if (!user) throw new ApiError(404, 'User not found')

    if (data.email) {
        const existingUser = await User.findOne({
            email: data.email.toLowerCase(),
            _id: { $ne: id },
        })
        if (existingUser)
            throw new ApiError(409, 'A user with this email already exists')
        data.email = data.email.toLowerCase()
    }

    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) user[key] = data[key]
    })
    await user.save()

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    logger.info('User updated', { id, adminId })
    return userObj
}

/**
 * Invite a user via email
 */
export const inviteUserEntry = async (data, adminId) => {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() })
    if (existingUser)
        throw new ApiError(409, 'A user with this email already exists')

    const tempPassword = Math.random().toString(36).slice(-8)
    const user = new User({
        email: data.email.toLowerCase(),
        role: data.role,
        millId: data.millId || null,
        password: tempPassword,
        isActive: false,
    })
    await user.save()

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    logger.info('User invited', { id: user._id, email: data.email, adminId })
    return userObj
}

/**
 * Suspend a user
 */
export const suspendUserEntry = async (id, adminId) => {
    const user = await User.findById(id)
    if (!user) throw new ApiError(404, 'User not found')
    if (user.role === ROLES.SUPER_ADMIN)
        throw new ApiError(400, 'Cannot suspend a super admin')

    user.isActive = false
    user.refreshToken = null
    await user.save()

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    logger.info('User suspended', { id, adminId })
    return userObj
}

/**
 * Reactivate a suspended user
 */
export const reactivateUserEntry = async (id, adminId) => {
    const user = await User.findById(id)
    if (!user) throw new ApiError(404, 'User not found')

    user.isActive = true
    await user.save()

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    logger.info('User reactivated', { id, adminId })
    return userObj
}

/**
 * Delete a user
 */
export const deleteUserEntry = async (id, adminId) => {
    const user = await User.findById(id)
    if (!user) throw new ApiError(404, 'User not found')
    if (user.role === ROLES.SUPER_ADMIN)
        throw new ApiError(400, 'Cannot delete a super admin')

    await User.findByIdAndDelete(id)
    logger.info('User deleted', { id, adminId })
}

/**
 * Bulk delete users
 */
export const bulkDeleteUserEntries = async (ids, adminId) => {
    const superAdminCount = await User.countDocuments({
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        role: ROLES.SUPER_ADMIN,
    })
    if (superAdminCount > 0)
        throw new ApiError(400, 'Cannot delete super admin users')

    const result = await User.deleteMany({
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    })
    logger.info('Users bulk deleted', { count: result.deletedCount, adminId })
    return result.deletedCount
}
