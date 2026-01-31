import mongoose from 'mongoose'
import { FinancialPayment } from '../models/financial-payment.model.js'
import logger from '../utils/logger.js'

/**
 * Financial Payment Service
 * Business logic for financial payment operations
 */

/**
 * Create a new financial payment entry
 * @param {string} millId - Mill ID
 * @param {object} data - Financial payment data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created financial payment entry
 */
export const createFinancialPaymentEntry = async (millId, data, userId) => {
    try {
        const financialPayment = new FinancialPayment({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await financialPayment.save()

        logger.info('Financial payment entry created', {
            id: financialPayment._id,
            millId,
            userId,
        })

        return financialPayment
    } catch (error) {
        logger.error('Failed to create financial payment entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get financial payment entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Financial payment ID
 * @returns {Promise<object>} Financial payment entry
 */
export const getFinancialPaymentById = async (millId, id) => {
    try {
        const financialPayment = await FinancialPayment.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!financialPayment) {
            const error = new Error('Financial payment entry not found')
            error.statusCode = 404
            throw error
        }

        return financialPayment
    } catch (error) {
        logger.error('Failed to get financial payment entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get financial payment list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated financial payment list
 */
export const getFinancialPaymentList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            paymentMode,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (paymentMode) {
            matchStage.paymentMode = paymentMode
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
        const aggregate = FinancialPayment.aggregate([
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
        const result = await FinancialPayment.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get financial payment list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get financial payment summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getFinancialPaymentSummary = async (millId, options = {}) => {
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

        const [summary] = await FinancialPayment.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    // Payment mode counts
                    cashCount: {
                        $sum: {
                            $cond: [{ $eq: ['$paymentMode', 'Cash'] }, 1, 0],
                        },
                    },
                    bankCount: {
                        $sum: {
                            $cond: [{ $eq: ['$paymentMode', 'Bank'] }, 1, 0],
                        },
                    },
                    chequeCount: {
                        $sum: {
                            $cond: [{ $eq: ['$paymentMode', 'Cheque'] }, 1, 0],
                        },
                    },
                    upiCount: {
                        $sum: {
                            $cond: [{ $eq: ['$paymentMode', 'UPI'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalAmount: { $round: ['$totalAmount', 2] },
                    paymentModeCounts: {
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
                paymentModeCounts: {
                    Cash: 0,
                    Bank: 0,
                    Cheque: 0,
                    UPI: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get financial payment summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a financial payment entry
 * @param {string} millId - Mill ID
 * @param {string} id - Financial payment ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated financial payment entry
 */
export const updateFinancialPaymentEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const financialPayment = await FinancialPayment.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!financialPayment) {
            const error = new Error('Financial payment entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Financial payment entry updated', {
            id,
            millId,
            userId,
        })

        return financialPayment
    } catch (error) {
        logger.error('Failed to update financial payment entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a financial payment entry
 * @param {string} millId - Mill ID
 * @param {string} id - Financial payment ID
 * @returns {Promise<void>}
 */
export const deleteFinancialPaymentEntry = async (millId, id) => {
    try {
        const financialPayment = await FinancialPayment.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!financialPayment) {
            const error = new Error('Financial payment entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Financial payment entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete financial payment entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete financial payment entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of financial payment IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteFinancialPaymentEntries = async (millId, ids) => {
    try {
        const result = await FinancialPayment.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Financial payment entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete financial payment entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
