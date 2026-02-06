import mongoose from 'mongoose'
import { MILL_STATUS } from '../constants/mill.status.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'
import { Mill } from '../models/mill.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Create a new mill
 */
export const createMillEntry = async (data, userId) => {
    const existingMill = await Mill.findOne({
        'contact.email': data.contact.email.toLowerCase(),
    })
    if (existingMill)
        throw new ApiError(409, 'A mill with this email already exists')

    const existingGst = await Mill.findOne({
        'millInfo.gstNumber': data.millInfo.gstNumber,
    })
    if (existingGst)
        throw new ApiError(409, 'A mill with this GST number already exists')

    const mill = new Mill({
        ...data,
        contact: { ...data.contact, email: data.contact.email.toLowerCase() },
    })
    await mill.save()

    const user = await User.findById(userId)
    user.millId = mill._id
    await user.save()

    logger.info('Mill created', { id: mill._id, userId })
    return mill
}

/**
 * Get mill by ID
 */
export const getMillById = async (id) => {
    const mill = await Mill.findById(id).populate(
        'currentPlan',
        'name price billingCycle features'
    )
    if (!mill) throw new ApiError(404, 'Mill not found')
    return mill
}

/**
 * Get mills list with pagination and filters
 */
export const getMillsList = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = options

    const matchStage = {}
    if (status) matchStage.status = status
    if (search) {
        matchStage.$or = [
            { millName: { $regex: search, $options: 'i' } },
            { 'contact.email': { $regex: search, $options: 'i' } },
            { 'contact.phone': { $regex: search, $options: 'i' } },
            { 'millInfo.gstNumber': { $regex: search, $options: 'i' } },
        ]
    }

    const sortStage = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

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
                    { $project: { name: 1, price: 1, billingCycle: 1 } },
                ],
            },
        },
        { $unwind: { path: '$planDetails', preserveNullAndEmptyArrays: true } },
        { $addFields: { currentPlan: { $ifNull: ['$planDetails', null] } } },
        { $project: { planDetails: 0 } },
    ])

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
}

/**
 * Get mills summary statistics
 */
export const getMillsSummary = async () => {
    const [statusCounts, recentMills, totalMills] = await Promise.all([
        Mill.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Mill.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('currentPlan', 'name price billingCycle'),
        Mill.countDocuments(),
    ])

    const statusCountsObj = {
        PENDING_VERIFICATION: 0,
        ACTIVE: 0,
        SUSPENDED: 0,
        REJECTED: 0,
    }
    statusCounts.forEach((item) => {
        statusCountsObj[item._id] = item.count
    })

    return { totalMills, statusCounts: statusCountsObj, recentMills }
}

/**
 * Update a mill
 */
export const updateMillEntry = async (id, data, userId) => {
    const mill = await Mill.findById(id)
    if (!mill) throw new ApiError(404, 'Mill not found')

    if (data.contact?.email) {
        const existingMill = await Mill.findOne({
            'contact.email': data.contact.email.toLowerCase(),
            _id: { $ne: id },
        })
        if (existingMill)
            throw new ApiError(409, 'A mill with this email already exists')
    }

    if (data.millInfo?.gstNumber) {
        const existingGst = await Mill.findOne({
            'millInfo.gstNumber': data.millInfo.gstNumber,
            _id: { $ne: id },
        })
        if (existingGst)
            throw new ApiError(
                409,
                'A mill with this GST number already exists'
            )
    }

    if (data.millInfo)
        mill.millInfo = { ...mill.millInfo.toObject(), ...data.millInfo }
    if (data.contact)
        mill.contact = {
            ...mill.contact.toObject(),
            ...data.contact,
            email: data.contact.email
                ? data.contact.email.toLowerCase()
                : mill.contact.email,
        }
    if (data.settings)
        mill.settings = { ...mill.settings.toObject(), ...data.settings }
    if (data.millName) mill.millName = data.millName
    if (data.status) mill.status = data.status
    if (data.currentPlan !== undefined) mill.currentPlan = data.currentPlan
    if (data.planValidUntil !== undefined)
        mill.planValidUntil = data.planValidUntil

    await mill.save()
    logger.info('Mill updated', { id, userId })
    return mill
}

/**
 * Verify a mill (approve or reject)
 */
export const verifyMillEntry = async (id, status, rejectionReason, userId) => {
    const mill = await Mill.findById(id)
    if (!mill) throw new ApiError(404, 'Mill not found')
    if (mill.status !== MILL_STATUS.PENDING_VERIFICATION)
        throw new ApiError(400, 'Mill is not pending verification')

    const user = await User.findOne({ millId: mill._id })
    if (!user) throw new ApiError(404, 'No user associated with this mill')

    user.role =
        status === MILL_STATUS.ACTIVE ? ROLES.MILL_ADMIN : ROLES.GUEST_USER
    await user.save()
    mill.status = MILL_STATUS.ACTIVE
    await mill.save()

    logger.info('Mill verified', { id, status, userId })
    return mill
}

/**
 * Suspend a mill
 */
export const suspendMillEntry = async (id, userId) => {
    const mill = await Mill.findById(id)
    if (!mill) throw new ApiError(404, 'Mill not found')
    if (mill.status !== MILL_STATUS.ACTIVE)
        throw new ApiError(400, 'Only active mills can be suspended')

    mill.status = MILL_STATUS.SUSPENDED
    await mill.save()

    logger.info('Mill suspended', { id, userId })
    return mill
}

/**
 * Reactivate a suspended mill
 */
export const reactivateMillEntry = async (id, userId) => {
    const mill = await Mill.findById(id)
    if (!mill) throw new ApiError(404, 'Mill not found')
    if (mill.status !== MILL_STATUS.SUSPENDED)
        throw new ApiError(400, 'Only suspended mills can be reactivated')

    mill.status = MILL_STATUS.ACTIVE
    await mill.save()

    logger.info('Mill reactivated', { id, userId })
    return mill
}

/**
 * Delete a mill
 */
export const deleteMillEntry = async (id) => {
    const mill = await Mill.findById(id)
    if (!mill) throw new ApiError(404, 'Mill not found')

    const usersCount = await User.countDocuments({ millId: id })
    if (usersCount > 0)
        throw new ApiError(
            400,
            'Cannot delete mill with associated users. Remove users first.'
        )

    await Mill.findByIdAndDelete(id)
    logger.info('Mill deleted', { id })
}

/**
 * Bulk delete mills
 */
export const bulkDeleteMillEntries = async (ids) => {
    const usersCount = await User.countDocuments({
        millId: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    })
    if (usersCount > 0)
        throw new ApiError(
            400,
            'Cannot delete mills with associated users. Remove users first.'
        )

    const result = await Mill.deleteMany({
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    })
    logger.info('Mills bulk deleted', { count: result.deletedCount })
    return result.deletedCount
}
