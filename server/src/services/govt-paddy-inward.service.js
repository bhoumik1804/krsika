import mongoose from 'mongoose'
import { GovtPaddyInward } from '../models/govt-paddy-inward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createGovtPaddyInwardEntry = async (millId, data, userId) => {
    const entry = new GovtPaddyInward({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Govt paddy inward entry created', {
        id: entry._id,
        millId,
        userId,
    })

    // Record stock transaction (CREDIT - incoming paddy)
    try {
        const totalQtl = (entry.paddyMota || 0) + (entry.paddyPatla || 0) + (entry.paddySarna || 0) + (entry.paddyMahamaya || 0) + (entry.paddyRbGold || 0)
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Paddy',
            variety: entry.paddyType || null,
            type: 'CREDIT',
            action: 'Inward',
            quantity: totalQtl,
            bags: 0,
            refModel: 'GovtPaddyInward',
            refId: entry._id,
            remarks: `Govt Paddy Inward - ${entry.committeeName || 'Committee'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for govt paddy inward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getGovtPaddyInwardById = async (millId, id) => {
    const entry = await GovtPaddyInward.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Govt paddy inward entry not found')
    return entry
}

export const getGovtPaddyInwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    if (search)
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { vehicleNumber: { $regex: search, $options: 'i' } },
        ]

    const aggregate = GovtPaddyInward.aggregate([
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
    const result = await GovtPaddyInward.aggregatePaginate(aggregate, {
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

export const getGovtPaddyInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await GovtPaddyInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalBags: { $sum: '$bags' },
                totalWeight: { $sum: '$weight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalBags: 1,
                totalWeight: { $round: ['$totalWeight', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalBags: 0, totalWeight: 0 }
}

export const updateGovtPaddyInwardEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GovtPaddyInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Govt paddy inward entry not found')
    logger.info('Govt paddy inward entry updated', { id, millId, userId })
    return entry
}

export const deleteGovtPaddyInwardEntry = async (millId, id) => {
    const entry = await GovtPaddyInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Govt paddy inward entry not found')
    logger.info('Govt paddy inward entry deleted', { id, millId })
}

export const bulkDeleteGovtPaddyInwardEntries = async (millId, ids) => {
    const result = await GovtPaddyInward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Govt paddy inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
