import mongoose from 'mongoose'
import { Broker } from '../models/broker.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createBrokerEntry = async (millId, data) => {
    const broker = new Broker({ ...data, millId })
    await broker.save()
    logger.info('Broker created', { id: broker._id, millId })
    return broker
}

export const getBrokerById = async (millId, id) => {
    const broker = await Broker.findOne({ _id: id, millId })

    if (!broker) {
        throw new ApiError(404, 'Broker not found')
    }

    return broker
}

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
        ]
    }

    const aggregate = Broker.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
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

export const getBrokerSummary = async (millId) => {
    const [summary] = await Broker.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalBrokers: { $sum: 1 } } },
        { $project: { _id: 0, totalBrokers: 1 } },
    ])

    return summary || { totalBrokers: 0 }
}

export const updateBrokerEntry = async (millId, id, data) => {
    const broker = await Broker.findOneAndUpdate(
        { _id: id, millId },
        { ...data },
        { new: true, runValidators: true }
    )

    if (!broker) {
        throw new ApiError(404, 'Broker not found')
    }

    logger.info('Broker updated', { id, millId })
    return broker
}

export const deleteBrokerEntry = async (millId, id) => {
    const broker = await Broker.findOneAndDelete({ _id: id, millId })

    if (!broker) {
        throw new ApiError(404, 'Broker not found')
    }

    logger.info('Broker deleted', { id, millId })
}

export const bulkDeleteBrokerEntries = async (millId, ids) => {
    const result = await Broker.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Brokers bulk deleted', { millId, count: result.deletedCount })
    return result.deletedCount
}
