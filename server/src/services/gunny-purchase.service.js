import mongoose from 'mongoose'
import { GunnyPurchase } from '../models/gunny-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createGunnyPurchaseEntry = async (millId, data) => {
    const entry = new GunnyPurchase({
        ...data,
        millId,
        date: new Date(data.date),
    })
    await entry.save()
    logger.info('Gunny purchase entry created', { id: entry._id, millId })
    return entry
}

export const getGunnyPurchaseById = async (millId, id) => {
    const entry = await GunnyPurchase.findOne({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny purchase entry not found')
    return entry
}

export const getGunnyPurchaseList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }
    if (search)
        matchStage.$or = [
            { partyName: { $regex: search, $options: 'i' } },
            { deliveryType: { $regex: search, $options: 'i' } },
        ]

    const aggregate = GunnyPurchase.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
    ])
    const result = await GunnyPurchase.aggregatePaginate(aggregate, {
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

export const getGunnyPurchaseSummary = async (millId) => {
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    const [summary] = await GunnyPurchase.aggregate([
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
                totalNewGunnyQty: 1,
                totalOldGunnyQty: 1,
                totalPlasticGunnyQty: 1,
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

export const updateGunnyPurchaseEntry = async (millId, id, data) => {
    const updateData = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GunnyPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Gunny purchase entry not found')
    logger.info('Gunny purchase entry updated', { id, millId })
    return entry
}

export const deleteGunnyPurchaseEntry = async (millId, id) => {
    const entry = await GunnyPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny purchase entry not found')
    logger.info('Gunny purchase entry deleted', { id, millId })
}

export const bulkDeleteGunnyPurchaseEntries = async (millId, ids) => {
    const result = await GunnyPurchase.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Gunny purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
