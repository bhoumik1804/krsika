/**
 * Staff Service
 * =============
 * Business logic for staff management
 */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import User from '../../../shared/models/user.model.js'

const StaffService = {
    /**
     * Find all staff for a mill with pagination
     */
    async findAll({
        millId,
        page = 1,
        limit = 10,
        search,
        role,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    }) {
        const query = {
            mill: new mongoose.Types.ObjectId(millId),
            role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
        }

        if (role) {
            query.role = role
        }

        if (typeof isActive === 'boolean') {
            query.isActive = isActive
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ]
        }

        const aggregate = User.aggregate([
            { $match: query },
            {
                $project: {
                    password: 0,
                    refreshTokens: 0,
                },
            },
            {
                $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
            },
        ])

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }

        return User.aggregatePaginate(aggregate, options)
    },

    /**
     * Find staff by ID
     */
    async findById(staffId, millId) {
        return User.findOne({
            _id: staffId,
            mill: millId,
            role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
        }).select('-password -refreshTokens')
    },

    /**
     * Find staff by email
     */
    async findByEmail(email, millId) {
        return User.findOne({
            email,
            mill: millId,
            role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
        }).select('-password -refreshTokens')
    },

    /**
     * Create new staff member
     */
    async create({
        millId,
        name,
        email,
        password,
        phone,
        role = USER_ROLES.MILL_STAFF,
        permissions = [],
    }) {
        // Check if email already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new Error('Email already registered')
        }

        // Validate role
        if (![USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF].includes(role)) {
            throw new Error('Invalid role for staff member')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        const staff = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            mill: millId,
            permissions,
            isActive: true,
            isEmailVerified: true, // Staff created by admin, no verification needed
        })

        const saved = await staff.save()

        // Return without sensitive data
        return User.findById(saved._id).select('-password -refreshTokens')
    },

    /**
     * Update staff member
     */
    async update(staffId, millId, updateData) {
        // Don't allow updating password through this method
        delete updateData.password
        delete updateData.refreshTokens

        // Check email uniqueness if updating email
        if (updateData.email) {
            const existingUser = await User.findOne({
                email: updateData.email,
                _id: { $ne: staffId },
            })
            if (existingUser) {
                throw new Error('Email already registered')
            }
        }

        // Validate role if updating
        if (
            updateData.role &&
            ![USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF].includes(
                updateData.role
            )
        ) {
            throw new Error('Invalid role for staff member')
        }

        return User.findOneAndUpdate(
            {
                _id: staffId,
                mill: millId,
                role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
            },
            updateData,
            { new: true, runValidators: true }
        ).select('-password -refreshTokens')
    },

    /**
     * Reset staff password
     */
    async resetPassword(staffId, millId, newPassword) {
        const staff = await User.findOne({
            _id: staffId,
            mill: millId,
            role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
        })

        if (!staff) {
            return null
        }

        staff.password = await bcrypt.hash(newPassword, 12)
        staff.refreshTokens = [] // Invalidate all sessions
        await staff.save()

        return { success: true }
    },

    /**
     * Delete staff member
     */
    async delete(staffId, millId) {
        const staff = await User.findOne({
            _id: staffId,
            mill: millId,
            role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
        })

        if (!staff) {
            return null
        }

        // Check if this is the last admin
        if (staff.role === USER_ROLES.MILL_ADMIN) {
            const adminCount = await User.countDocuments({
                mill: millId,
                role: USER_ROLES.MILL_ADMIN,
                isActive: true,
            })

            if (adminCount <= 1) {
                throw new Error('Cannot delete the last mill admin')
            }
        }

        return User.findByIdAndDelete(staffId)
    },

    /**
     * Toggle staff active status
     */
    async toggleStatus(staffId, millId) {
        const staff = await User.findOne({
            _id: staffId,
            mill: millId,
            role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
        })

        if (!staff) {
            return null
        }

        // Check if deactivating the last admin
        if (staff.isActive && staff.role === USER_ROLES.MILL_ADMIN) {
            const activeAdminCount = await User.countDocuments({
                mill: millId,
                role: USER_ROLES.MILL_ADMIN,
                isActive: true,
            })

            if (activeAdminCount <= 1) {
                throw new Error('Cannot deactivate the last active mill admin')
            }
        }

        staff.isActive = !staff.isActive

        // Clear refresh tokens if deactivating
        if (!staff.isActive) {
            staff.refreshTokens = []
        }

        await staff.save()

        return User.findById(staff._id).select('-password -refreshTokens')
    },

    /**
     * Update staff permissions
     */
    async updatePermissions(staffId, millId, permissions) {
        return User.findOneAndUpdate(
            {
                _id: staffId,
                mill: millId,
                role: { $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF] },
            },
            { permissions },
            { new: true }
        ).select('-password -refreshTokens')
    },

    /**
     * Get staff summary for a mill
     */
    async getSummary(millId) {
        return User.aggregate([
            {
                $match: {
                    mill: new mongoose.Types.ObjectId(millId),
                    role: {
                        $in: [USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
                    },
                },
            },
            {
                $group: {
                    _id: '$role',
                    total: { $sum: 1 },
                    active: { $sum: { $cond: ['$isActive', 1, 0] } },
                    inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
                },
            },
            {
                $group: {
                    _id: null,
                    totalStaff: { $sum: '$total' },
                    totalActive: { $sum: '$active' },
                    totalInactive: { $sum: '$inactive' },
                    byRole: {
                        $push: {
                            role: '$_id',
                            total: '$total',
                            active: '$active',
                            inactive: '$inactive',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalStaff: 1,
                    totalActive: 1,
                    totalInactive: 1,
                    byRole: 1,
                },
            },
        ])
    },
}

export default StaffService
