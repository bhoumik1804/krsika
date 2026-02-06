import mongoose from 'mongoose'
import { DailyPayment } from '../models/daily-payment.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createDailyPaymentEntry = async (millId, data, userId) => {
    const entry = new DailyPayment({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Daily payment entry created', {
        id: entry._id,
        millId,
        userId,
    })
    return entry
}

export const getDailyPaymentById = async (millId, id) => {
    const entry = await DailyPayment.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily payment entry not found')
    return entry
}

export const getDailyPaymentList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        status,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (status) matchStage.status = status
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { paymentMode: { $regex: search, $options: 'i' } },
            { referenceNumber: { $regex: search, $options: 'i' } },
        ]
    }

    const aggregate = DailyPayment.aggregate([
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

    const result = await DailyPayment.aggregatePaginate(aggregate, {
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

export const getDailyPaymentSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await DailyPayment.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
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

export const updateDailyPaymentEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await DailyPayment.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
    if (!entry) throw new ApiError(404, 'Daily payment entry not found')
    logger.info('Daily payment entry updated', { id, millId, userId })
    return entry
}

export const deleteDailyPaymentEntry = async (millId, id) => {
    const entry = await DailyPayment.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Daily payment entry not found')
    logger.info('Daily payment entry deleted', { id, millId })
}

export const bulkDeleteDailyPaymentEntries = async (millId, ids) => {
    const result = await DailyPayment.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Daily payment entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
