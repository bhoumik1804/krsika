import mongoose from 'mongoose'
import { PrivateRiceOutward } from '../models/private-rice-outward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createPrivateRiceOutwardEntry = async (millId, data) => {
    const entry = new PrivateRiceOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Private rice outward entry created', {
        id: entry._id,
        millId,
    })
    return entry
}

export const getPrivateRiceOutwardById = async (millId, id) => {
    const entry = await PrivateRiceOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Private rice outward entry not found')
    return entry
}

export const getPrivateRiceOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        riceType,
        partyName,
        brokerName,
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
    if (riceType)
        matchStage.riceType = { $regex: escapeRegex(riceType), $options: 'i' }
    if (partyName)
        matchStage.partyName = { $regex: escapeRegex(partyName), $options: 'i' }
    if (brokerName)
        matchStage.brokerName = {
            $regex: escapeRegex(brokerName),
            $options: 'i',
        }

    if (search)
        matchStage.$or = [
            { partyName: { $regex: escapeRegex(search), $options: 'i' } },
            { truckNumber: { $regex: escapeRegex(search), $options: 'i' } },
            { riceType: { $regex: escapeRegex(search), $options: 'i' } },
            {
                riceSaleDealNumber: {
                    $regex: escapeRegex(search),
                    $options: 'i',
                },
            },
            { truckRst: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = PrivateRiceOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await PrivateRiceOutward.aggregatePaginate(aggregate, {
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

export const getPrivateRiceOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await PrivateRiceOutward.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalRiceQty: { $sum: '$riceQty' },
                totalGunnyNew: { $sum: '$gunnyNew' },
                totalGunnyOld: { $sum: '$gunnyOld' },
                totalGunnyPlastic: { $sum: '$gunnyPlastic' },
                totalJuteWeight: { $sum: '$juteWeight' },
                totalPlasticWeight: { $sum: '$plasticWeight' },
                totalTruckWeight: { $sum: '$truckWeight' },
                totalGunnyWeight: { $sum: '$gunnyWeight' },
                totalNetWeight: { $sum: '$netWeight' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalRiceQty: { $round: ['$totalRiceQty', 2] },
                totalGunnyNew: { $round: ['$totalGunnyNew', 2] },
                totalGunnyOld: { $round: ['$totalGunnyOld', 2] },
                totalGunnyPlastic: { $round: ['$totalGunnyPlastic', 2] },
                totalJuteWeight: { $round: ['$totalJuteWeight', 2] },
                totalPlasticWeight: { $round: ['$totalPlasticWeight', 2] },
                totalTruckWeight: { $round: ['$totalTruckWeight', 2] },
                totalGunnyWeight: { $round: ['$totalGunnyWeight', 2] },
                totalNetWeight: { $round: ['$totalNetWeight', 2] },
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalRiceQty: 0,
            totalGunnyNew: 0,
            totalGunnyOld: 0,
            totalGunnyPlastic: 0,
            totalJuteWeight: 0,
            totalPlasticWeight: 0,
            totalTruckWeight: 0,
            totalGunnyWeight: 0,
            totalNetWeight: 0,
        }
    )
}

export const updatePrivateRiceOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await PrivateRiceOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Private rice outward entry not found')
    logger.info('Private rice outward entry updated', { id, millId })
    return entry
}

export const deletePrivateRiceOutwardEntry = async (millId, id) => {
    const entry = await PrivateRiceOutward.findOneAndDelete({
        _id: id,
        millId,
    })
    if (!entry) throw new ApiError(404, 'Private rice outward entry not found')
    logger.info('Private rice outward entry deleted', { id, millId })
}

export const bulkDeletePrivateRiceOutwardEntries = async (millId, ids) => {
    const result = await PrivateRiceOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Private rice outward entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
