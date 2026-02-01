import { Mill } from '../models/mill.model.js'
import { User } from '../models/user.model.js'
import logger from '../utils/logger.js'

/**
 * Staff Service
 * Business logic for staff management (Mill Admin operations)
 */

/**
 * Create a new staff member
 * @param {string} millId - Mill ID
 * @param {object} data - Staff data
 * @param {string} adminId - Admin ID who created the staff
 * @returns {Promise<object>} Created staff member
 */
export const createStaffEntry = async (millId, data, adminId) => {
    try {
        // Verify mill exists
        const mill = await Mill.findById(millId)
        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: data.email.toLowerCase(),
        })

        if (existingUser) {
            const error = new Error('A user with this email already exists')
            error.statusCode = 409
            throw error
        }

        // Create new staff member (User with mill-staff role)
        const staff = new User({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phoneNumber: data.phoneNumber,
            password: data.password, // Password will be hashed by pre-save hook
            millId,
            role: 'mill-staff',
            isActive: data.isActive !== false,
        })

        await staff.save()

        // Format response
        const staffObj = staff.toObject()
        delete staffObj.password
        delete staffObj.refreshToken

        logger.info('Staff member created', {
            staffId: staff._id,
            millId,
            adminId,
        })

        return staffObj
    } catch (error) {
        logger.error('Failed to create staff member', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff member by ID
 * @param {string} millId - Mill ID
 * @param {string} staffId - Staff ID
 * @returns {Promise<object>} Staff member
 */
export const getStaffById = async (millId, staffId) => {
    try {
        const staff = await User.findOne({
            _id: staffId,
            millId,
            role: 'mill-staff',
        }).select('-password -refreshToken')

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        return staff.toObject()
    } catch (error) {
        logger.error('Failed to get staff member', {
            millId,
            staffId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get all staff members with pagination
 * @param {string} millId - Mill ID
 * @param {object} query - Query parameters
 * @returns {Promise<object>} Staff list with pagination
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
    try {
        const skip = (page - 1) * limit

        // Build filter
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

        // Build sort
        const sortObject = {}
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Execute queries
        const [data, total] = await Promise.all([
            User.find(filter)
                .select('-password -refreshToken')
                .sort(sortObject)
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
    } catch (error) {
        logger.error('Failed to get staff list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff summary statistics
 * @param {string} millId - Mill ID
 * @returns {Promise<object>} Summary statistics
 */
export const getStaffSummary = async (millId) => {
    try {
        const [totalStaff, activeStaff, inactiveStaff] = await Promise.all([
            User.countDocuments({ millId, role: 'mill-staff' }),
            User.countDocuments({ millId, role: 'mill-staff', isActive: true }),
            User.countDocuments({
                millId,
                role: 'mill-staff',
                isActive: false,
            }),
        ])

        return {
            totalStaff,
            activeStaff,
            inactiveStaff,
        }
    } catch (error) {
        logger.error('Failed to get staff summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update staff member
 * @param {string} millId - Mill ID
 * @param {string} staffId - Staff ID
 * @param {object} data - Update data
 * @param {string} adminId - Admin ID
 * @returns {Promise<object>} Updated staff member
 */
export const updateStaffEntry = async (millId, staffId, data, adminId) => {
    try {
        // Find staff member
        const staff = await User.findOne({
            _id: staffId,
            millId,
            role: 'mill-staff',
        })

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        // Check if new email exists (if email is being updated)
        if (data.email && data.email.toLowerCase() !== staff.email) {
            const existingUser = await User.findOne({
                email: data.email.toLowerCase(),
            })

            if (existingUser) {
                const error = new Error('This email is already in use')
                error.statusCode = 409
                throw error
            }

            staff.email = data.email.toLowerCase()
        }

        // Update allowed fields
        if (data.fullName) staff.fullName = data.fullName
        if (data.phoneNumber !== undefined) staff.phoneNumber = data.phoneNumber
        if (data.isActive !== undefined) staff.isActive = data.isActive

        await staff.save()

        logger.info('Staff member updated', {
            staffId,
            millId,
            adminId,
        })

        const staffObj = staff.toObject()
        delete staffObj.password
        delete staffObj.refreshToken

        return staffObj
    } catch (error) {
        logger.error('Failed to update staff member', {
            millId,
            staffId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete staff member
 * @param {string} millId - Mill ID
 * @param {string} staffId - Staff ID
 * @param {string} adminId - Admin ID
 * @returns {Promise<object>} Deleted staff member
 */
export const deleteStaffEntry = async (millId, staffId, adminId) => {
    try {
        const staff = await User.findOneAndDelete({
            _id: staffId,
            millId,
            role: 'mill-staff',
        })

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Staff member deleted', {
            staffId,
            millId,
            adminId,
        })

        return staff.toObject()
    } catch (error) {
        logger.error('Failed to delete staff member', {
            millId,
            staffId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete staff members
 * @param {string} millId - Mill ID
 * @param {array} ids - Array of staff IDs to delete
 * @param {string} adminId - Admin ID
 * @returns {Promise<object>} Deletion result
 */
export const bulkDeleteStaffEntries = async (millId, ids, adminId) => {
    try {
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

        return {
            deletedCount: result.deletedCount,
        }
    } catch (error) {
        logger.error('Failed to bulk delete staff members', {
            millId,
            error: error.message,
        })
        throw error
    }
}
