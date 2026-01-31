import mongoose from 'mongoose'
import { FinancialReceipt } from '../models/financial-receipt.model.js'
import logger from '../utils/logger.js'

/**
 * Financial Receipt Service
 * Business logic for financial receipt operations
 */

/**
 * Create a new financial receipt entry
 * @param {string} millId - Mill ID
 * @param {object} data - Financial receipt data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created financial receipt entry
 */
export const createFinancialReceiptEntry = async (millId, data, userId) => {
    try {
        const financialReceipt = new FinancialReceipt({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await financialReceipt.save()

        logger.info('Financial receipt entry created', {
            id: financialReceipt._id,
            millId,
            userId,
        })

        return financialReceipt
    } catch (error) {
        logger.error('Failed to create financial receipt entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get financial receipt entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Financial receipt ID
 * @returns {Promise<object>} Financial receipt entry
 */
export const getFinancialReceiptById = async (millId, id) => {
    try {
        const financialReceipt = await FinancialReceipt.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!financialReceipt) {
            const error = new Error('Financial receipt entry not found')
            error.statusCode = 404
            throw error
        }

        return financialReceipt
    } catch (error) {
        logger.error('Failed to get financial receipt entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get financial receipt list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated financial receipt list
 */
export const getFinancialReceiptList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            receiptMode,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (receiptMode) {
            matchStage.receiptMode = receiptMode
        }

        if (startDate || endDate) {
            matchStage.date = {}
            if (startDate) {
                matchStage.date.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        if (search) {
            matchStage.$or = [
                { partyName: { $regex: search, $options: 'i' } },
                { bank: { $regex: search, $options: 'i' } },
                { narration: { $regex: search, $options: 'i' } },
                { accountHead: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = FinancialReceipt.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
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

        // Use aggregatePaginate for pagination
        const result = await FinancialReceipt.aggregatePaginate(aggregate, {
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
    } catch (error) {
        logger.error('Failed to get financial receipt list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get financial receipt summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getFinancialReceiptSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate } = options

        // Build match stage
        const match = { millId: new mongoose.Types.ObjectId(millId) }
        if (startDate || endDate) {
            match.date = {}
            if (startDate) {
                match.date.$gte = new Date(startDate)
            }
            if (endDate) {
                match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        const [summary] = await FinancialReceipt.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    // Receipt mode counts
                    cashCount: {
                        $sum: {
                            $cond: [{ $eq: ['$receiptMode', 'Cash'] }, 1, 0],
                        },
                    },
                    bankCount: {
                        $sum: {
                            $cond: [{ $eq: ['$receiptMode', 'Bank'] }, 1, 0],
                        },
                    },
                    chequeCount: {
                        $sum: {
                            $cond: [{ $eq: ['$receiptMode', 'Cheque'] }, 1, 0],
                        },
                    },
                    upiCount: {
                        $sum: {
                            $cond: [{ $eq: ['$receiptMode', 'UPI'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalAmount: { $round: ['$totalAmount', 2] },
                    receiptModeCounts: {
                        Cash: '$cashCount',
                        Bank: '$bankCount',
                        Cheque: '$chequeCount',
                        UPI: '$upiCount',
                    },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalAmount: 0,
                receiptModeCounts: {
                    Cash: 0,
                    Bank: 0,
                    Cheque: 0,
                    UPI: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get financial receipt summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a financial receipt entry
 * @param {string} millId - Mill ID
 * @param {string} id - Financial receipt ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated financial receipt entry
 */
export const updateFinancialReceiptEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const financialReceipt = await FinancialReceipt.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!financialReceipt) {
            const error = new Error('Financial receipt entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Financial receipt entry updated', {
            id,
            millId,
            userId,
        })

        return financialReceipt
    } catch (error) {
        logger.error('Failed to update financial receipt entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a financial receipt entry
 * @param {string} millId - Mill ID
 * @param {string} id - Financial receipt ID
 * @returns {Promise<void>}
 */
export const deleteFinancialReceiptEntry = async (millId, id) => {
    try {
        const financialReceipt = await FinancialReceipt.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!financialReceipt) {
            const error = new Error('Financial receipt entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Financial receipt entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete financial receipt entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete financial receipt entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of financial receipt IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteFinancialReceiptEntries = async (millId, ids) => {
    try {
        const result = await FinancialReceipt.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Financial receipt entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete financial receipt entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
