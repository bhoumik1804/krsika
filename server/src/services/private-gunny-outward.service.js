import mongoose from 'mongoose'
import { PrivateGunnyOutward } from '../models/private-gunny-outward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createPrivateGunnyOutwardEntry = async (millId, data) => {
    const entry = new PrivateGunnyOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Private gunny outward entry created', {
        id: entry._id,
        millId,
    })
    return entry
}

export const getPrivateGunnyOutwardById = async (millId, id) => {
    const entry = await PrivateGunnyOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Private gunny outward entry not found')
    return entry
}

export const getPrivateGunnyOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        partyName,
        gunnyPurchaseDealNumber,
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
    if (partyName)
        matchStage.partyName = { $regex: escapeRegex(partyName), $options: 'i' }
    if (gunnyPurchaseDealNumber)
        matchStage.gunnyPurchaseDealNumber = {
            $regex: escapeRegex(gunnyPurchaseDealNumber),
            $options: 'i',
        }

    // Search across multiple fields
    if (search)
        matchStage.$or = [
            { partyName: { $regex: escapeRegex(search), $options: 'i' } },
            {
                gunnyPurchaseDealNumber: {
                    $regex: escapeRegex(search),
                    $options: 'i',
                },
            },
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = PrivateGunnyOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await PrivateGunnyOutward.aggregatePaginate(aggregate, {
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

export const getPrivateGunnyOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await PrivateGunnyOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalNewGunnyQty: { $sum: '$newGunnyQty' },
                totalOldGunnyQty: { $sum: '$oldGunnyQty' },
                totalPlasticGunnyQty: { $sum: '$plasticGunnyQty' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalNewGunnyQty: { $round: ['$totalNewGunnyQty', 2] },
                totalOldGunnyQty: { $round: ['$totalOldGunnyQty', 2] },
                totalPlasticGunnyQty: { $round: ['$totalPlasticGunnyQty', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalNewGunnyQty: 0,
            totalOldGunnyQty: 0,
            totalPlasticGunnyQty: 0,
        }
    )
}

export const updatePrivateGunnyOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await PrivateGunnyOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Private gunny outward entry not found')
    logger.info('Private gunny outward entry updated', { id, millId })
    return entry
}

export const deletePrivateGunnyOutwardEntry = async (millId, id) => {
    const entry = await PrivateGunnyOutward.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Private gunny outward entry not found')
    logger.info('Private gunny outward entry deleted', { id, millId })
}

export const bulkDeletePrivateGunnyOutwardEntries = async (millId, ids) => {
    const result = await PrivateGunnyOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Private gunny outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
