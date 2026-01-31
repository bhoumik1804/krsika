import mongoose from 'mongoose'
import { Broker } from '../models/broker.model.js'
import logger from '../utils/logger.js'

/**
 * Broker Service
 * Business logic for broker operations
 */

/**
 * Create a new broker
 */
export const createBrokerEntry = async (millId, data, userId) => {
    try {
        const broker = new Broker({
            ...data,
            millId,
            createdBy: userId,
        })

        await broker.save()

        logger.info('Broker created', {
            id: broker._id,
            millId,
            userId,
        })

        return broker
    } catch (error) {
        logger.error('Failed to create broker', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get broker by ID
 */
export const getBrokerById = async (millId, id) => {
    try {
        const broker = await Broker.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!broker) {
            const error = new Error('Broker not found')
            error.statusCode = 404
            throw error
        }

        return broker
    } catch (error) {
        logger.error('Failed to get broker', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get broker list with pagination and filters
 */
export const getBrokerList = async (millId, options = {}) => {
    try {
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

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

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
    } catch (error) {
        logger.error('Failed to get broker list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get broker summary statistics
 */
export const getBrokerSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await Broker.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalBrokers: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalBrokers: 1,
                },
            },
        ])

        return (
            summary || {
                totalBrokers: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get broker summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a broker
 */
export const updateBrokerEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const broker = await Broker.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!broker) {
            const error = new Error('Broker not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Broker updated', {
            id,
            millId,
            userId,
        })

        return broker
    } catch (error) {
        logger.error('Failed to update broker', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a broker
 */
export const deleteBrokerEntry = async (millId, id) => {
    try {
        const broker = await Broker.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!broker) {
            const error = new Error('Broker not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Broker deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete broker', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete brokers
 */
export const bulkDeleteBrokerEntries = async (millId, ids) => {
    try {
        const result = await Broker.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Brokers bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete brokers', {
            millId,
            error: error.message,
        })
        throw error
    }
}
