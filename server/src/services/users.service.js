import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import logger from '../utils/logger.js'

/**
 * Users Service (Super Admin)
 * Business logic for users management
 */

/**
 * Create a new user
 * @param {object} data - User data
 * @param {string} adminId - Admin user ID who created the entry
 * @returns {Promise<object>} Created user
 */
export const createUserEntry = async (data, adminId) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({
            email: data.email.toLowerCase(),
        })

        if (existingUser) {
            const error = new Error('A user with this email already exists')
            error.statusCode = 409
            throw error
        }

        const user = new User({
            ...data,
            email: data.email.toLowerCase(),
        })

        await user.save()

        // Return user without sensitive fields
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.refreshToken

        logger.info('User created', {
            id: user._id,
            adminId,
        })

        return userObj
    } catch (error) {
        logger.error('Failed to create user', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<object>} User
 */
export const getUserById = async (id) => {
    try {
        const user = await User.findById(id)
            .select('-password -refreshToken')
            .populate('millId', 'millName status')

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        return user
    } catch (error) {
        logger.error('Failed to get user', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get users list with pagination and filters
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated users list
 */
export const getUsersList = async (options = {}) => {
    try {
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

        // Build match stage
        const matchStage = {}

        if (role) {
            matchStage.role = role
        }

        if (typeof isActive === 'boolean') {
            matchStage.isActive = isActive
        }

        if (millId) {
            matchStage.millId = new mongoose.Types.ObjectId(millId)
        }

        if (search) {
            matchStage.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = User.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            {
                $lookup: {
                    from: 'mills',
                    localField: 'millId',
                    foreignField: '_id',
                    as: 'millDetails',
                    pipeline: [
                        {
                            $project: {
                                millName: 1,
                                status: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$millDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    millId: {
                        $ifNull: ['$millDetails', null],
                    },
                },
            },
            {
                $project: {
                    password: 0,
                    refreshToken: 0,
                    millDetails: 0,
                },
            },
        ])

        // Use aggregatePaginate for pagination
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
    } catch (error) {
        logger.error('Failed to get users list', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Get users summary statistics
 * @returns {Promise<object>} Summary
 */
export const getUsersSummary = async () => {
    try {
        const [roleCounts, statusCounts, recentUsers, totalUsers] =
            await Promise.all([
                User.aggregate([
                    {
                        $group: {
                            _id: '$role',
                            count: { $sum: 1 },
                        },
                    },
                ]),
                User.aggregate([
                    {
                        $group: {
                            _id: '$isActive',
                            count: { $sum: 1 },
                        },
                    },
                ]),
                User.find()
                    .select('-password -refreshToken')
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('millId', 'millName status'),
                User.countDocuments(),
            ])

        // Transform role counts to object
        const roleCountsObj = {
            'super-admin': 0,
            'mill-admin': 0,
            'mill-staff': 0,
            'guest-user': 0,
        }

        roleCounts.forEach((item) => {
            roleCountsObj[item._id] = item.count
        })

        // Transform status counts to object
        const statusCountsObj = {
            active: 0,
            inactive: 0,
            suspended: 0,
        }

        statusCounts.forEach((item) => {
            if (item._id === true) {
                statusCountsObj.active = item.count
            } else {
                statusCountsObj.inactive = item.count
            }
        })

        return {
            totalUsers,
            roleCounts: roleCountsObj,
            statusCounts: statusCountsObj,
            recentUsers,
        }
    } catch (error) {
        logger.error('Failed to get users summary', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a user
 * @param {string} id - User ID
 * @param {object} data - Update data
 * @param {string} adminId - Admin user ID who updated the entry
 * @returns {Promise<object>} Updated user
 */
export const updateUserEntry = async (id, data, adminId) => {
    try {
        const user = await User.findById(id)

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        // Check for email uniqueness if updating email
        if (data.email) {
            const existingUser = await User.findOne({
                email: data.email.toLowerCase(),
                _id: { $ne: id },
            })

            if (existingUser) {
                const error = new Error('A user with this email already exists')
                error.statusCode = 409
                throw error
            }
            data.email = data.email.toLowerCase()
        }

        // Update fields
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                user[key] = data[key]
            }
        })

        await user.save()

        // Return user without sensitive fields
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.refreshToken

        logger.info('User updated', {
            id,
            adminId,
        })

        return userObj
    } catch (error) {
        logger.error('Failed to update user', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Invite a user via email
 * @param {object} data - Invite data
 * @param {string} adminId - Admin user ID who invited
 * @returns {Promise<object>} Created user
 */
export const inviteUserEntry = async (data, adminId) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({
            email: data.email.toLowerCase(),
        })

        if (existingUser) {
            const error = new Error('A user with this email already exists')
            error.statusCode = 409
            throw error
        }

        // Create user with temporary password
        const tempPassword = Math.random().toString(36).slice(-8)

        const user = new User({
            email: data.email.toLowerCase(),
            role: data.role,
            millId: data.millId || null,
            password: tempPassword,
            isActive: false, // User needs to activate via email
        })

        await user.save()

        // TODO: Send invitation email with temporary password

        // Return user without sensitive fields
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.refreshToken

        logger.info('User invited', {
            id: user._id,
            email: data.email,
            adminId,
        })

        return userObj
    } catch (error) {
        logger.error('Failed to invite user', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Suspend a user
 * @param {string} id - User ID
 * @param {string} adminId - Admin user ID who suspended
 * @returns {Promise<object>} Updated user
 */
export const suspendUserEntry = async (id, adminId) => {
    try {
        const user = await User.findById(id)

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        // Cannot suspend super admin
        if (user.role === ROLES.SUPER_ADMIN) {
            const error = new Error('Cannot suspend a super admin')
            error.statusCode = 400
            throw error
        }

        user.isActive = false
        user.refreshToken = null // Invalidate refresh token

        await user.save()

        // Return user without sensitive fields
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.refreshToken

        logger.info('User suspended', {
            id,
            adminId,
        })

        return userObj
    } catch (error) {
        logger.error('Failed to suspend user', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Reactivate a suspended user
 * @param {string} id - User ID
 * @param {string} adminId - Admin user ID who reactivated
 * @returns {Promise<object>} Updated user
 */
export const reactivateUserEntry = async (id, adminId) => {
    try {
        const user = await User.findById(id)

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        user.isActive = true

        await user.save()

        // Return user without sensitive fields
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.refreshToken

        logger.info('User reactivated', {
            id,
            adminId,
        })

        return userObj
    } catch (error) {
        logger.error('Failed to reactivate user', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @param {string} adminId - Admin user ID who deleted
 * @returns {Promise<void>}
 */
export const deleteUserEntry = async (id, adminId) => {
    try {
        const user = await User.findById(id)

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        // Cannot delete super admin
        if (user.role === ROLES.SUPER_ADMIN) {
            const error = new Error('Cannot delete a super admin')
            error.statusCode = 400
            throw error
        }

        await User.findByIdAndDelete(id)

        logger.info('User deleted', { id, adminId })
    } catch (error) {
        logger.error('Failed to delete user', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete users
 * @param {string[]} ids - User IDs
 * @param {string} adminId - Admin user ID who deleted
 * @returns {Promise<number>} Deleted count
 */
export const bulkDeleteUserEntries = async (ids, adminId) => {
    try {
        // Check if any super admins are in the list
        const superAdminCount = await User.countDocuments({
            _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
            role: ROLES.SUPER_ADMIN,
        })

        if (superAdminCount > 0) {
            const error = new Error('Cannot delete super admin users')
            error.statusCode = 400
            throw error
        }

        const result = await User.deleteMany({
            _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        })

        logger.info('Users bulk deleted', {
            count: result.deletedCount,
            adminId,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete users', {
            error: error.message,
        })
        throw error
    }
}
