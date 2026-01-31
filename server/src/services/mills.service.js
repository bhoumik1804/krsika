import mongoose from 'mongoose'
import { MILL_STATUS } from '../constants/mill.status.enum.js'
import { Mill } from '../models/mill.model.js'
import { User } from '../models/user.model.js'
import logger from '../utils/logger.js'

/**
 * Mills Service (Super Admin)
 * Business logic for mills management
 */

/**
 * Create a new mill
 * @param {object} data - Mill data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created mill
 */
export const createMillEntry = async (data, userId) => {
    try {
        // Check if email already exists
        const existingMill = await Mill.findOne({
            'contact.email': data.contact.email.toLowerCase(),
        })

        if (existingMill) {
            const error = new Error('A mill with this email already exists')
            error.statusCode = 409
            throw error
        }

        // Check if GST number already exists
        const existingGst = await Mill.findOne({
            'millInfo.gstNumber': data.millInfo.gstNumber,
        })

        if (existingGst) {
            const error = new Error(
                'A mill with this GST number already exists'
            )
            error.statusCode = 409
            throw error
        }

        const mill = new Mill({
            ...data,
            contact: {
                ...data.contact,
                email: data.contact.email.toLowerCase(),
            },
        })

        await mill.save()

        logger.info('Mill created', {
            id: mill._id,
            userId,
        })

        return mill
    } catch (error) {
        logger.error('Failed to create mill', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Get mill by ID
 * @param {string} id - Mill ID
 * @returns {Promise<object>} Mill
 */
export const getMillById = async (id) => {
    try {
        const mill = await Mill.findById(id).populate(
            'currentPlan',
            'name price billingCycle features'
        )

        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        return mill
    } catch (error) {
        logger.error('Failed to get mill', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get mills list with pagination and filters
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated mills list
 */
export const getMillsList = async (options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = {}

        if (status) {
            matchStage.status = status
        }

        if (search) {
            matchStage.$or = [
                { millName: { $regex: search, $options: 'i' } },
                { 'contact.email': { $regex: search, $options: 'i' } },
                { 'contact.phone': { $regex: search, $options: 'i' } },
                { 'millInfo.gstNumber': { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = Mill.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            {
                $lookup: {
                    from: 'plans',
                    localField: 'currentPlan',
                    foreignField: '_id',
                    as: 'planDetails',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                price: 1,
                                billingCycle: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$planDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    currentPlan: {
                        $ifNull: ['$planDetails', null],
                    },
                },
            },
            {
                $project: {
                    planDetails: 0,
                },
            },
        ])

        // Use aggregatePaginate for pagination
        const result = await Mill.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get mills list', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Get mills summary statistics
 * @returns {Promise<object>} Summary
 */
export const getMillsSummary = async () => {
    try {
        const [statusCounts, recentMills, totalMills] = await Promise.all([
            Mill.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
            Mill.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('currentPlan', 'name price billingCycle'),
            Mill.countDocuments(),
        ])

        // Transform status counts to object
        const statusCountsObj = {
            PENDING_VERIFICATION: 0,
            ACTIVE: 0,
            SUSPENDED: 0,
            REJECTED: 0,
        }

        statusCounts.forEach((item) => {
            statusCountsObj[item._id] = item.count
        })

        return {
            totalMills,
            statusCounts: statusCountsObj,
            recentMills,
        }
    } catch (error) {
        logger.error('Failed to get mills summary', {
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a mill
 * @param {string} id - Mill ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated mill
 */
export const updateMillEntry = async (id, data, userId) => {
    try {
        const mill = await Mill.findById(id)

        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        // Check for email uniqueness if updating email
        if (data.contact?.email) {
            const existingMill = await Mill.findOne({
                'contact.email': data.contact.email.toLowerCase(),
                _id: { $ne: id },
            })

            if (existingMill) {
                const error = new Error('A mill with this email already exists')
                error.statusCode = 409
                throw error
            }
        }

        // Check for GST uniqueness if updating GST
        if (data.millInfo?.gstNumber) {
            const existingGst = await Mill.findOne({
                'millInfo.gstNumber': data.millInfo.gstNumber,
                _id: { $ne: id },
            })

            if (existingGst) {
                const error = new Error(
                    'A mill with this GST number already exists'
                )
                error.statusCode = 409
                throw error
            }
        }

        // Update nested objects properly
        if (data.millInfo) {
            mill.millInfo = { ...mill.millInfo.toObject(), ...data.millInfo }
        }
        if (data.contact) {
            mill.contact = {
                ...mill.contact.toObject(),
                ...data.contact,
                email: data.contact.email
                    ? data.contact.email.toLowerCase()
                    : mill.contact.email,
            }
        }
        if (data.settings) {
            mill.settings = { ...mill.settings.toObject(), ...data.settings }
        }

        // Update other fields
        if (data.millName) mill.millName = data.millName
        if (data.status) mill.status = data.status
        if (data.currentPlan !== undefined) mill.currentPlan = data.currentPlan
        if (data.planValidUntil !== undefined)
            mill.planValidUntil = data.planValidUntil

        await mill.save()

        logger.info('Mill updated', {
            id,
            userId,
        })

        return mill
    } catch (error) {
        logger.error('Failed to update mill', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Verify a mill (approve or reject)
 * @param {string} id - Mill ID
 * @param {string} status - New status (ACTIVE or REJECTED)
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User ID who verified
 * @returns {Promise<object>} Updated mill
 */
export const verifyMillEntry = async (id, status, rejectionReason, userId) => {
    try {
        const mill = await Mill.findById(id)

        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        if (mill.status !== MILL_STATUS.PENDING_VERIFICATION) {
            const error = new Error('Mill is not pending verification')
            error.statusCode = 400
            throw error
        }

        mill.status = status

        await mill.save()

        logger.info('Mill verified', {
            id,
            status,
            userId,
        })

        return mill
    } catch (error) {
        logger.error('Failed to verify mill', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Suspend a mill
 * @param {string} id - Mill ID
 * @param {string} userId - User ID who suspended
 * @returns {Promise<object>} Updated mill
 */
export const suspendMillEntry = async (id, userId) => {
    try {
        const mill = await Mill.findById(id)

        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        if (mill.status !== MILL_STATUS.ACTIVE) {
            const error = new Error('Only active mills can be suspended')
            error.statusCode = 400
            throw error
        }

        mill.status = MILL_STATUS.SUSPENDED

        await mill.save()

        logger.info('Mill suspended', {
            id,
            userId,
        })

        return mill
    } catch (error) {
        logger.error('Failed to suspend mill', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Reactivate a suspended mill
 * @param {string} id - Mill ID
 * @param {string} userId - User ID who reactivated
 * @returns {Promise<object>} Updated mill
 */
export const reactivateMillEntry = async (id, userId) => {
    try {
        const mill = await Mill.findById(id)

        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        if (mill.status !== MILL_STATUS.SUSPENDED) {
            const error = new Error('Only suspended mills can be reactivated')
            error.statusCode = 400
            throw error
        }

        mill.status = MILL_STATUS.ACTIVE

        await mill.save()

        logger.info('Mill reactivated', {
            id,
            userId,
        })

        return mill
    } catch (error) {
        logger.error('Failed to reactivate mill', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a mill
 * @param {string} id - Mill ID
 * @returns {Promise<void>}
 */
export const deleteMillEntry = async (id) => {
    try {
        const mill = await Mill.findById(id)

        if (!mill) {
            const error = new Error('Mill not found')
            error.statusCode = 404
            throw error
        }

        // Check if there are users associated with this mill
        const usersCount = await User.countDocuments({ millId: id })
        if (usersCount > 0) {
            const error = new Error(
                'Cannot delete mill with associated users. Remove users first.'
            )
            error.statusCode = 400
            throw error
        }

        await Mill.findByIdAndDelete(id)

        logger.info('Mill deleted', { id })
    } catch (error) {
        logger.error('Failed to delete mill', {
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete mills
 * @param {string[]} ids - Mill IDs
 * @returns {Promise<number>} Deleted count
 */
export const bulkDeleteMillEntries = async (ids) => {
    try {
        // Check for associated users
        const usersCount = await User.countDocuments({
            millId: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        })

        if (usersCount > 0) {
            const error = new Error(
                'Cannot delete mills with associated users. Remove users first.'
            )
            error.statusCode = 400
            throw error
        }

        const result = await Mill.deleteMany({
            _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
        })

        logger.info('Mills bulk deleted', {
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete mills', {
            error: error.message,
        })
        throw error
    }
}
