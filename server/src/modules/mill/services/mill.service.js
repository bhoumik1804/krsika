/**
 * Mill Service
 * =============
 * Business logic for mill operations
 */
import { MILL_STATUS } from '../../../shared/constants/misc-types.js'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import Mill from '../../../shared/models/mill.model.js'
import User from '../../../shared/models/user.model.js'
import ApiError from '../../../shared/utils/api-error.js'
import { paginate } from '../../../shared/utils/pagination.js'

class MillService {
    /**
     * Get all mills (Super Admin only)
     */
    async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            status,
        } = options

        const query = {}

        // Apply filters
        if (status) {
            query.status = status
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ]
        }

        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
        const skip = (page - 1) * limit

        const [data, total] = await Promise.all([
            Mill.find(query)
                .populate('ownerId', 'name email phone')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Mill.countDocuments(query),
        ])

        return paginate(data, { page, limit, total })
    }

    /**
     * Get mill by ID
     */
    async findById(millId) {
        const mill = await Mill.findById(millId)
            .populate('ownerId', 'name email phone avatar')
            .lean()

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        return mill
    }

    /**
     * Get mill by code
     */
    async findByCode(code) {
        const mill = await Mill.findOne({ code: code.toUpperCase() })
            .populate('ownerId', 'name email phone')
            .lean()

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        return mill
    }

    /**
     * Create a new mill
     */
    async create(data, createdById) {
        // Check if mill code already exists
        const existingMill = await Mill.findOne({
            code: data.code.toUpperCase(),
        })
        if (existingMill) {
            throw ApiError.conflict('Mill code already exists')
        }

        // Create the mill
        const mill = await Mill.create({
            ...data,
            code: data.code.toUpperCase(),
            ownerId: createdById,
            status: MILL_STATUS.ACTIVE,
        })

        // Update user's millId if they don't have one
        await User.findByIdAndUpdate(
            createdById,
            { $set: { millId: mill._id } },
            { new: true }
        )

        return mill
    }

    /**
     * Update mill
     */
    async update(millId, data) {
        const mill = await Mill.findById(millId)

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        // If updating code, check for duplicates
        if (data.code && data.code.toUpperCase() !== mill.code) {
            const existingMill = await Mill.findOne({
                code: data.code.toUpperCase(),
                _id: { $ne: millId },
            })
            if (existingMill) {
                throw ApiError.conflict('Mill code already exists')
            }
            data.code = data.code.toUpperCase()
        }

        Object.assign(mill, data)
        await mill.save()

        return mill
    }

    /**
     * Update mill status
     */
    async updateStatus(millId, status) {
        const mill = await Mill.findById(millId)

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        if (!Object.values(MILL_STATUS).includes(status)) {
            throw ApiError.badRequest('Invalid mill status')
        }

        mill.status = status
        await mill.save()

        return mill
    }

    /**
     * Delete mill (Super Admin only)
     */
    async delete(millId) {
        const mill = await Mill.findById(millId)

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        // Check if mill has any users
        const usersCount = await User.countDocuments({ millId })
        if (usersCount > 1) {
            throw ApiError.badRequest(
                'Cannot delete mill with active users. Please remove all users first.'
            )
        }

        await Mill.findByIdAndDelete(millId)

        return { message: 'Mill deleted successfully' }
    }

    /**
     * Get mill statistics
     */
    async getStats(millId) {
        const mill = await Mill.findById(millId)

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        // Get counts in parallel
        const [staffCount, activeStaffCount] = await Promise.all([
            User.countDocuments({ millId }),
            User.countDocuments({ millId, isActive: true }),
        ])

        return {
            mill: {
                _id: mill._id,
                name: mill.name,
                code: mill.code,
                status: mill.status,
            },
            stats: {
                totalStaff: staffCount,
                activeStaff: activeStaffCount,
            },
        }
    }

    /**
     * Update mill settings
     */
    async updateSettings(millId, settings) {
        const mill = await Mill.findById(millId)

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        // Merge new settings with existing
        const currentSettings = mill.settings || new Map()
        for (const [key, value] of Object.entries(settings)) {
            currentSettings.set(key, value)
        }
        mill.settings = currentSettings

        await mill.save()

        return mill
    }

    /**
     * Get mill settings
     */
    async getSettings(millId) {
        const mill = await Mill.findById(millId).select('settings').lean()

        if (!mill) {
            throw ApiError.notFound('Mill not found')
        }

        return mill.settings || {}
    }
}

export default new MillService()
