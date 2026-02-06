import mongoose from 'mongoose'
import { StockOverview } from '../models/stock-overview.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createStockOverviewEntry = async (millId, data, userId) => {
    const entry = new StockOverview({ ...data, millId, createdBy: userId })
    await entry.save()
    logger.info('Stock overview entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getStockOverviewById = async (millId, id) => {
    const entry = await StockOverview.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Stock overview entry not found')
    return entry
}

export const getStockOverviewList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { itemName: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = StockOverview.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
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

    const result = await StockOverview.aggregatePaginate(aggregate, {
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

export const getStockOverviewSummary = async (millId) => {
    const [summary] = await StockOverview.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalStock: { $sum: '$quantity' },
            },
        },
        { $project: { _id: 0, totalEntries: 1, totalStock: 1 } },
    ])
    return summary || { totalEntries: 0, totalStock: 0 }
}

export const updateStockOverviewEntry = async (millId, id, data, userId) => {
    const entry = await StockOverview.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Stock overview entry not found')
    logger.info('Stock overview entry updated', { id, millId, userId })
    return entry
}

export const deleteStockOverviewEntry = async (millId, id) => {
    const entry = await StockOverview.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Stock overview entry not found')
    logger.info('Stock overview entry deleted', { id, millId })
}

export const bulkDeleteStockOverviewEntries = async (millId, ids) => {
    const result = await StockOverview.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Stock overview entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
