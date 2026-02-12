import mongoose from 'mongoose'
import NakkhiOutward from '../models/nakkhi-outward.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const createNakkhiOutwardEntry = async (millId, data) => {
    const entry = new NakkhiOutward({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Nakkhi outward entry created', { id: entry._id, millId })
    return entry
}

export const getNakkhiOutwardById = async (millId, id) => {
    const entry = await NakkhiOutward.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Nakkhi outward entry not found')
    return entry
}

export const getNakkhiOutwardList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
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
            { truckNo: { $regex: escapeRegex(search), $options: 'i' } },
            {
                nakkhiSaleDealNumber: {
                    $regex: escapeRegex(search),
                    $options: 'i',
                },
            },
            { truckRst: { $regex: escapeRegex(search), $options: 'i' } },
        ]

    const aggregate = NakkhiOutward.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await NakkhiOutward.aggregatePaginate(aggregate, {
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

export const getNakkhiOutwardSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const result = await NakkhiOutward.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalNetWeight: { $sum: { $ifNull: ['$netWeight', 0] } },
            },
        },
    ])

    return (
        result[0] || {
            totalEntries: 0,
            totalNetWeight: 0,
        }
    )
}

export const updateNakkhiOutwardEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const entry = await NakkhiOutward.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Nakkhi outward entry not found')
    logger.info('Nakkhi outward entry updated', { id, millId })
    return entry
}

export const deleteNakkhiOutwardEntry = async (millId, id) => {
    const entry = await NakkhiOutward.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Nakkhi outward entry not found')
    logger.info('Nakkhi outward entry deleted', { id, millId })
    return entry
}

export const bulkDeleteNakkhiOutwardEntries = async (millId, ids) => {
    const result = await NakkhiOutward.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Nakkhi outward entries bulk deleted', {
        count: result.deletedCount,
        millId,
    })
    return { deletedCount: result.deletedCount }
}
