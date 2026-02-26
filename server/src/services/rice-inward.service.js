import mongoose from 'mongoose'
import { RiceInward } from '../models/rice-inward.model.js'
import * as StockTransactionService from './stock-transaction.service.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createRiceInwardEntry = async (millId, data, userId) => {
    const entry = new RiceInward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Rice inward entry created', { id: entry._id, millId })

    // Record stock transaction (CREDIT - incoming rice)
    try {
        const totalQtl = (entry.riceMotaNetWeight || 0) + (entry.ricePatlaNetWeight || 0)
        await StockTransactionService.recordTransaction(millId, {
            date: entry.date,
            commodity: 'Rice',
            variety: entry.riceType || null,
            type: 'CREDIT',
            action: 'Inward',
            quantity: totalQtl / 100, // Convert Kg to Qtl
            bags: 0,
            refModel: 'RiceInward',
            refId: entry._id,
            remarks: `Rice Inward - ${entry.partyName || 'Party'}`,
        }, userId)
    } catch (err) {
        logger.error('Failed to record stock for rice inward', { id: entry._id, error: err.message })
    }

    return entry
}

export const getRiceInwardById = async (millId, id) => {
    const entry = await RiceInward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Rice inward entry not found')
    return entry
}

export const getRiceInwardList = async (millId, options = {}) => {
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
            { ricePurchaseDealNumber: { $regex: search, $options: 'i' } },
            { truckNumber: { $regex: search, $options: 'i' } },
            { rstNumber: { $regex: search, $options: 'i' } },
        ]

    const aggregate = RiceInward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await RiceInward.aggregatePaginate(aggregate, {
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

export const getRiceInwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await RiceInward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalMotaWeight: { $sum: '$riceMotaNetWeight' },
                totalPatlaWeight: { $sum: '$ricePatlaNetWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalMotaWeight: { $round: ['$totalMotaWeight', 2] },
                totalPatlaWeight: { $round: ['$totalPatlaWeight', 2] },
                totalNetWeight: {
                    $round: [
                        { $add: ['$totalMotaWeight', '$totalPatlaWeight'] },
                        2,
                    ],
                },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalMotaWeight: 0,
            totalPatlaWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updateRiceInwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await RiceInward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Rice inward entry not found')
    logger.info('Rice inward entry updated', { id, millId })
    return entry
}

export const deleteRiceInwardEntry = async (millId, id) => {
    const entry = await RiceInward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Rice inward entry not found')
    logger.info('Rice inward entry deleted', { id, millId })
}

export const bulkDeleteRiceInwardEntries = async (millId, ids) => {
    const result = await RiceInward.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Rice inward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
