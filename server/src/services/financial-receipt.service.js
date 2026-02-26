import mongoose from 'mongoose'
import { FinancialReceipt } from '../models/financial-receipt.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createFinancialReceiptEntry = async (millId, data, userId) => {
    const entry = new FinancialReceipt({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Financial receipt entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getFinancialReceiptById = async (millId, id) => {
    const entry = await FinancialReceipt.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Financial receipt entry not found')
    return entry
}

export const getFinancialReceiptList = async (millId, options = {}) => {
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
    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { salesDealType: { $regex: search, $options: 'i' } },
            { salesDealNumber: { $regex: search, $options: 'i' } },
            { brokerName: { $regex: search, $options: 'i' } },
            { remarks: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = FinancialReceipt.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])

    const result = await FinancialReceipt.aggregatePaginate(aggregate, {
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

export const getFinancialReceiptSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await FinancialReceipt.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalAmount: { $sum: '$receivedAmount' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalAmount: { $round: ['$totalAmount', 2] },
            },
        },
    ])
    return summary || { totalEntries: 0, totalAmount: 0 }
}

export const updateFinancialReceiptEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await FinancialReceipt.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Financial receipt entry not found')
    logger.info('Financial receipt entry updated', { id, millId, userId })
    return entry
}

export const deleteFinancialReceiptEntry = async (millId, id) => {
    const entry = await FinancialReceipt.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Financial receipt entry not found')
    logger.info('Financial receipt entry deleted', { id, millId })
}

export const bulkDeleteFinancialReceiptEntries = async (millId, ids) => {
    const result = await FinancialReceipt.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Financial receipt entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
