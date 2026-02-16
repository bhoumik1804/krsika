import mongoose from 'mongoose'
import { PaddySale } from '../models/paddy-sale.model.js'

export const createPaddySaleEntry = async (millId, data) => {
    return await PaddySale.create({ ...data, millId })
}

export const getPaddySaleList = async (millId, query) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'date',
        order = 'desc',
        startDate,
        endDate,
    } = query

    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { brokerName: { $regex: search, $options: 'i' } },
            { doNumber: { $regex: search, $options: 'i' } },
            { paddySalesDealNumber: { $regex: search, $options: 'i' } },
        ]
    }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate)
    }

    const sortStage = { [sortBy]: order === 'desc' ? -1 : 1 }

    const aggregate = PaddySale.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'privatepaddyoutwards',
                localField: 'paddySalesDealNumber',
                foreignField: 'paddySaleDealNumber',
                as: 'outwardData',
            },
        },
        { $sort: sortStage },
    ])

    return await PaddySale.aggregatePaginate(aggregate, {
        page,
        limit,
        customLabels: {
            docs: 'data',
            totalDocs: 'total',
            limit: 'pageSize',
            page: 'currentPage',
            totalPages: 'totalPages',
        },
    })
}

export const getPaddySaleById = async (millId, id) => {
    return await PaddySale.findOne({ _id: id, millId })
}

export const updatePaddySaleEntry = async (millId, id, data) => {
    return await PaddySale.findOneAndUpdate({ _id: id, millId }, data, {
        new: true,
        runValidators: true,
    })
}

export const deletePaddySaleEntry = async (millId, id) => {
    return await PaddySale.findOneAndDelete({ _id: id, millId })
}

export const bulkDeletePaddySaleEntries = async (millId, ids) => {
    return await PaddySale.deleteMany({
        _id: { $in: ids },
        millId,
    })
}

export const getPaddySaleSummary = async (millId, startDate, endDate) => {
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate)
    }

    const summary = await PaddySale.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalDhanMotaQty: { $sum: '$dhanMotaQty' },
                totalDhanPatlaQty: { $sum: '$dhanPatlaQty' },
                totalDhanSarnaQty: { $sum: '$dhanSarnaQty' },
                totalDhanQty: { $sum: '$dhanQty' }, // fallback if using dhanQty directly
                count: { $sum: 1 },
            },
        },
    ])

    return (
        summary[0] || {
            totalDhanMotaQty: 0,
            totalDhanPatlaQty: 0,
            totalDhanSarnaQty: 0,
            totalDhanQty: 0,
            count: 0,
        }
    )
}
