import mongoose from 'mongoose'
import { Broker } from '../models/broker.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Create a new broker
 */
export const createBrokerEntry = async (millId, data, userId) => {
    const broker = new Broker({
        ...data,
        millId,
        createdBy: userId,
    })

    await broker.save()

    logger.info('Broker created', { id: broker._id, millId, userId })

    return broker
}

/**
 * Get broker by ID
 */
export const getBrokerById = async (millId, id) => {
    const broker = await Broker.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!broker) {
        throw new ApiError(404, 'Broker not found')
    }

    return broker
}

/**
 * Get broker list with pagination and filters
 */
export const getBrokerList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'brokerName',
        sortOrder = 'asc',
    } = options

    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { brokerName: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
        ]
    }

    const sortStage = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const aggregate = Broker.aggregate([
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

    const result = await Broker.aggregatePaginate(aggregate, {
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
 * Get broker summary statistics
 */
export const getBrokerSummary = async (millId) => {
    const [summary] = await Broker.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalBrokers: { $sum: 1 } } },
        { $project: { _id: 0, totalBrokers: 1 } },
    ])

    return summary || { totalBrokers: 0 }
}

/**
 * Update a broker
 */
export const updateBrokerEntry = async (millId, id, data, userId) => {
    const broker = await Broker.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!broker) {
        throw new ApiError(404, 'Broker not found')
    }

    logger.info('Broker updated', { id, millId, userId })

    return broker
}

/**
 * Delete a broker
 */
export const deleteBrokerEntry = async (millId, id) => {
    const broker = await Broker.findOneAndDelete({ _id: id, millId })

    if (!broker) {
        throw new ApiError(404, 'Broker not found')
    }

    logger.info('Broker deleted', { id, millId })
}

/**
 * Bulk delete brokers
 */
export const bulkDeleteBrokerEntries = async (millId, ids) => {
    const result = await Broker.deleteMany({ _id: { $in: ids }, millId })

    logger.info('Brokers bulk deleted', { millId, count: result.deletedCount })

    return result.deletedCount
}
