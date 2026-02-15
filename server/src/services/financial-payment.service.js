import mongoose from 'mongoose'
import { FinancialPayment } from '../models/financial-payment.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createFinancialPaymentEntry = async (millId, data, userId) => {
    const entry = new FinancialPayment({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Financial payment entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getFinancialPaymentById = async (millId, id) => {
    const entry = await FinancialPayment.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Financial payment entry not found')
    return entry
}

export const getFinancialPaymentList = async (millId, options = {}) => {
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
            { paymentType: { $regex: search, $options: 'i' } },
            { purchaseDealNumber: { $regex: search, $options: 'i' } },
            { brokerName: { $regex: search, $options: 'i' } },
            { remarks: { $regex: search, $options: 'i' } },
        ]
    }

    // Use aggregatePaginate directly on the model, not via pipeline first for pagination
    // But existing code uses aggregatePaginate plugin which accepts an aggregate object
    const aggregate = FinancialPayment.aggregate([
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

    const result = await FinancialPayment.aggregatePaginate(aggregate, {
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

export const getFinancialPaymentSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await FinancialPayment.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalAmount: { $sum: '$paymentAmount' },
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

export const updateFinancialPaymentEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await FinancialPayment.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Financial payment entry not found')
    logger.info('Financial payment entry updated', { id, millId, userId })
    return entry
}

export const deleteFinancialPaymentEntry = async (millId, id) => {
    const entry = await FinancialPayment.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Financial payment entry not found')
    logger.info('Financial payment entry deleted', { id, millId })
}

export const bulkDeleteFinancialPaymentEntries = async (millId, ids) => {
    const result = await FinancialPayment.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Financial payment entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
