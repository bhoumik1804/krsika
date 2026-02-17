import mongoose from 'mongoose'
import { StockTransaction } from '../models/stock-transaction.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/**
 * Record a stock transaction
 * This is the central method called by all services to log stock movements
 */
export const recordTransaction = async (millId, data, userId = null) => {
    console.log('transaction')

    const transaction = new StockTransaction({
        ...data,
        millId,
        createdBy: userId,
        date: new Date(data.date),
    })
    await transaction.save()
    logger.info('Stock transaction recorded', {
        id: transaction._id,
        millId,
        commodity: data.commodity,
        type: data.type,
        action: data.action,
        quantity: data.quantity,
    })
    console.log(transaction)
    return transaction
}

/**
 * Update a stock transaction (used when source entry is updated)
 */
export const updateTransaction = async (refModel, refId, updates) => {
    const transaction = await StockTransaction.findOneAndUpdate(
        { refModel, refId },
        { ...updates, date: updates.date ? new Date(updates.date) : undefined },
        { new: true, runValidators: true }
    )
    if (!transaction) {
        logger.warn('Stock transaction not found for update', {
            refModel,
            refId,
        })
        return null
    }
    logger.info('Stock transaction updated', {
        id: transaction._id,
        refModel,
        refId,
    })
    return transaction
}

/**
 * Delete stock transaction(s) (used when source entry is deleted)
 */
export const deleteTransactionsByRef = async (refModel, refId) => {
    const result = await StockTransaction.deleteMany({ refModel, refId })
    logger.info('Stock transactions deleted', {
        refModel,
        refId,
        count: result.deletedCount,
    })
    return result.deletedCount
}

/**
 * Get stock transaction by ID
 */
export const getStockTransactionById = async (millId, id) => {
    const transaction = await StockTransaction.findOne({
        _id: id,
        millId,
    }).populate('createdBy', 'fullName email')
    if (!transaction) throw new ApiError(404, 'Stock transaction not found')
    return transaction
}

/**
 * Get list of stock transactions with filters and pagination
 */
export const getStockTransactionList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        commodity,
        variety,
        type,
        action,
        startDate,
        endDate,
        sortBy = 'date',
        sortOrder = 'desc',
    } = options

    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    // Apply filters
    if (commodity) matchStage.commodity = commodity
    if (variety) matchStage.variety = variety
    if (type) matchStage.type = type
    if (action) {
        if (action.includes(',')) {
            matchStage.action = { $in: action.split(',').map(a => a.trim()) }
        } else {
            matchStage.action = action
        }
    }
    if (startDate || endDate) {
        matchStage.date = {}
        if (startDate) matchStage.date.$gte = new Date(startDate)
        if (endDate) matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const aggregate = StockTransaction.aggregate([
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

    const result = await StockTransaction.aggregatePaginate(aggregate, {
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

/**
 * Get stock balance summary (current stock levels by commodity/variety)
 */
export const getStockBalance = async (millId, options = {}) => {
    const { commodity, variety, asOfDate } = options

    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (commodity) match.commodity = commodity
    if (variety) match.variety = variety
    if (asOfDate) match.date = { $lte: new Date(asOfDate + 'T23:59:59.999Z') }

    const balances = await StockTransaction.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    commodity: '$commodity',
                    variety: '$variety',
                },
                creditTotal: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'CREDIT'] }, '$quantity', 0],
                    },
                },
                debitTotal: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'DEBIT'] }, '$quantity', 0],
                    },
                },
                totalBags: { $sum: '$bags' },
            },
        },
        {
            $project: {
                _id: 0,
                commodity: '$_id.commodity',
                variety: '$_id.variety',
                creditTotal: { $round: ['$creditTotal', 2] },
                debitTotal: { $round: ['$debitTotal', 2] },
                balance: {
                    $round: [{ $subtract: ['$creditTotal', '$debitTotal'] }, 2],
                },
                totalBags: 1,
            },
        },
        { $sort: { commodity: 1, variety: 1 } },
    ])

    return balances
}

/**
 * Get stock transaction summary for a date range
 */
export const getStockTransactionSummary = async (millId, options = {}) => {
    const { startDate, endDate, commodity, variety } = options

    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (commodity) match.commodity = commodity
    if (variety) match.variety = variety
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    const [summary] = await StockTransaction.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalCredit: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'CREDIT'] }, '$quantity', 0],
                    },
                },
                totalDebit: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'DEBIT'] }, '$quantity', 0],
                    },
                },
                totalBags: { $sum: '$bags' },
            },
        },
        {
            $project: {
                _id: 0,
                totalTransactions: 1,
                totalCredit: { $round: ['$totalCredit', 2] },
                totalDebit: { $round: ['$totalDebit', 2] },
                netMovement: {
                    $round: [{ $subtract: ['$totalCredit', '$totalDebit'] }, 2],
                },
                totalBags: 1,
            },
        },
    ])

    return (
        summary || {
            totalTransactions: 0,
            totalCredit: 0,
            totalDebit: 0,
            netMovement: 0,
            totalBags: 0,
        }
    )
}

/**
 * Get stock quantities grouped by commodity+variety for a specific action and date range
 * This is the optimized endpoint used by daily report pages
 */
export const getStockByAction = async (millId, options = {}) => {
    const { action, startDate, endDate } = options

    console.log('getStockByAction Params:', { millId, action, startDate, endDate })

    const match = { millId: new mongoose.Types.ObjectId(millId) }
    if (action) {
        if (action.includes(',')) {
            match.action = { $in: action.split(',').map(a => a.trim()) }
        } else {
            match.action = action
        }
    }
    if (startDate || endDate) {
        match.date = {}
        if (startDate) match.date.$gte = new Date(startDate)
        if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
    }

    console.log('getStockByAction Match:', JSON.stringify(match, null, 2))

    const debugCount = await StockTransaction.countDocuments(match)
    console.log('getStockByAction Matching Documents Count:', debugCount)

    const result = await StockTransaction.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    commodity: '$commodity',
                    variety: '$variety',
                },
                totalQuantity: { $sum: '$quantity' },
                totalBags: { $sum: '$bags' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                commodity: '$_id.commodity',
                variety: '$_id.variety',
                totalQuantity: { $round: ['$totalQuantity', 2] },
                totalBags: 1,
                count: 1,
            },
        },
        { $sort: { commodity: 1, variety: 1 } },
    ])

    console.log('getStockByAction Result:', result)

    return result
}

/**
 * Bulk delete stock transactions
 */
export const bulkDeleteStockTransactions = async (millId, ids) => {
    const result = await StockTransaction.deleteMany({
        _id: { $in: ids },
        millId,
    })
    logger.info('Stock transactions bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
