import mongoose from 'mongoose'
import { NakkhiSale } from '../models/nakkhi-sale.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createNakkhiSaleEntry = async (millId, data) => {
    const entry = new NakkhiSale({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Nakkhi sale entry created', { id: entry._id, millId })
    return entry
}

export const getNakkhiSaleById = async (millId, id) => {
    const entry = await NakkhiSale.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Nakkhi sale entry not found')
    return entry
}

export const getNakkhiSaleList = async (millId, options = {}) => {
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
            { brokerName: { $regex: search, $options: 'i' } },
        ]

    const aggregate = NakkhiSale.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await NakkhiSale.aggregatePaginate(aggregate, {
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

export const getNakkhiSaleSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await NakkhiSale.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalNakkhiQty: { $sum: '$nakkhiQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalNakkhiQty: { $round: ['$totalNakkhiQty', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalNakkhiQty: 0 }
}

export const updateNakkhiSaleEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await NakkhiSale.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Nakkhi sale entry not found')
    logger.info('Nakkhi sale entry updated', { id, millId })
    return entry
}

export const deleteNakkhiSaleEntry = async (millId, id) => {
    const entry = await NakkhiSale.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Nakkhi sale entry not found')
    logger.info('Nakkhi sale entry deleted', { id, millId })
}

export const bulkDeleteNakkhiSaleEntries = async (millId, ids) => {
    const result = await NakkhiSale.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Nakkhi sale entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
