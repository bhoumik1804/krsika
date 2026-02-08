import mongoose from 'mongoose'
import { GovtGunnyOutward } from '../models/govt-gunny-outward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createGovtGunnyOutwardEntry = async (millId, data) => {
    const entry = new GovtGunnyOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Govt gunny outward entry created', {
        id: entry._id,
        millId,
    })
    return entry
}

export const getGovtGunnyOutwardById = async (millId, id) => {
    const entry = await GovtGunnyOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Govt gunny outward entry not found')
    return entry
}

export const getGovtGunnyOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        gunnyDmNumber,
        samitiSangrahan,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    // Date range filtering
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    // Individual field filtering
    if (gunnyDmNumber)
        matchStage.gunnyDmNumber = {
            $regex: escapeRegex(gunnyDmNumber),
            $options: 'i',
        }
    if (samitiSangrahan)
        matchStage.samitiSangrahan = {
            $regex: escapeRegex(samitiSangrahan),
            $options: 'i',
        }

    // Search across multiple fields
    if (search)
        matchStage.$or = [
            { gunnyDmNumber: { $regex: escapeRegex(search), $options: 'i' } },
            { samitiSangrahan: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = GovtGunnyOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await GovtGunnyOutward.aggregatePaginate(aggregate, {
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

export const getGovtGunnyOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await GovtGunnyOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalOldGunnyQty: { $sum: '$oldGunnyQty' },
                totalPlasticGunnyQty: { $sum: '$plasticGunnyQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalOldGunnyQty: { $round: ['$totalOldGunnyQty', 2] },
                totalPlasticGunnyQty: { $round: ['$totalPlasticGunnyQty', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalOldGunnyQty: 0,
            totalPlasticGunnyQty: 0,
        }
    )
}

export const updateGovtGunnyOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GovtGunnyOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Govt gunny outward entry not found')
    logger.info('Govt gunny outward entry updated', { id, millId })
    return entry
}

export const deleteGovtGunnyOutwardEntry = async (millId, id) => {
    const entry = await GovtGunnyOutward.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Govt gunny outward entry not found')
    logger.info('Govt gunny outward entry deleted', { id, millId })
}

export const bulkDeleteGovtGunnyOutwardEntries = async (millId, ids) => {
    const result = await GovtGunnyOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Govt gunny outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
