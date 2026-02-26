import mongoose from 'mongoose'
import { GunnyPurchase } from '../models/gunny-purchase.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

export const createGunnyPurchaseEntry = async (millId, data, userId) => {
    const entry = new GunnyPurchase({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await entry.save()

    // Record stock transaction (CREDIT)
    try {
        await StockTransactionService.recordTransaction(
            millId,
            {
                date: data.date,
                commodity: 'Gunny',
                variety: null,
                type: 'CREDIT',
                action: 'Purchase',
                // For Gunny, if no weight is tracked, we can use 0 quantity or use bags as quantity if that's the convention.
                // Assuming 0 quantity since bags are tracked separately.
                quantity: 0,
                bags: data.totalBags || 0,
                refModel: 'GunnyPurchase',
                refId: entry._id,
                remarks: `Purchase from ${data.partyName || 'Party'}`,
            },
            userId
        )
    } catch (err) {
        logger.error('Failed to record stock for gunny purchase', {
            id: entry._id,
            error: err.message,
        })
    }

    logger.info('Gunny purchase entry created', {
        id: entry._id,
        millId,
        userId,
    })
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

export const getGunnyPurchaseSummary = async (millId, options = {}) => {
    const { startDate, endDate } = options
    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    const [summary] = await GunnyPurchase.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalEntries: { $sum: 1 },
                totalNewGunnyQty: { $sum: '$newGunnyQty' },
                totalOldGunnyQty: { $sum: '$oldGunnyQty' },
                totalPlasticGunnyQty: { $sum: '$plasticGunnyQty' },
                totalBags: { $sum: '$totalBags' }, // Assuming totalBags field exists based on previous file view
            },
        },
        {
            $project: {
                _id: 0,
                totalEntries: 1,
                totalNewGunnyQty: 1,
                totalOldGunnyQty: 1,
                totalPlasticGunnyQty: 1,
                totalBags: 1,
            },
        },
    ])
    return (
        summary || {
            totalEntries: 0,
            totalNewGunnyQty: 0,
            totalOldGunnyQty: 0,
            totalPlasticGunnyQty: 0,
            totalBags: 0,
        }
    )
}

export const updateGunnyPurchaseEntry = async (millId, id, data, userId) => {
    const updateData = { ...data, updatedBy: userId }
    if (data.date) updateData.date = new Date(data.date)
    const entry = await GunnyPurchase.findOneAndUpdate(
        { _id: id, millId },
        updateData,
        { new: true, runValidators: true }
    )
    if (!entry) throw new ApiError(404, 'Gunny purchase entry not found')

    // Update stock transaction
    if (data.totalBags || data.date) {
        await StockTransactionService.updateTransaction('GunnyPurchase', id, {
            date: entry.date,
            commodity: 'Gunny',
            variety: null,
            quantity: 0,
            bags: entry.totalBags || 0,
            remarks: `Purchase from ${entry.partyName || 'Party'}`,
        })
    }

    logger.info('Gunny purchase entry updated', { id, millId, userId })
    return entry
}

export const deleteGunnyPurchaseEntry = async (millId, id) => {
    const entry = await GunnyPurchase.findOneAndDelete({ _id: id, millId })
    if (!entry) throw new ApiError(404, 'Gunny purchase entry not found')

    // Delete associated stock transactions
    await StockTransactionService.deleteTransactionsByRef('GunnyPurchase', id)

    logger.info('Gunny purchase entry deleted', { id, millId })
}

export const bulkDeleteGunnyPurchaseEntries = async (millId, ids) => {
    const result = await GunnyPurchase.deleteMany({ _id: { $in: ids }, millId })

    for (const id of ids) {
        await StockTransactionService.deleteTransactionsByRef(
            'GunnyPurchase',
            id
        )
    }

    logger.info('Gunny purchase entries bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
