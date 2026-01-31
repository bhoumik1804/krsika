import mongoose from 'mongoose'
import { DailyPayment } from '../models/daily-payment.model.js'
import logger from '../utils/logger.js'

/**
 * Daily Payment Service
 * Business logic for daily payment operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new daily payment entry
 * @param {string} millId - Mill ID
 * @param {object} data - Daily payment data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created daily payment entry
 */
export const createDailyPaymentEntry = async (millId, data, userId) => {
    try {
        const dailyPayment = new DailyPayment({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await dailyPayment.save()

        logger.info('Daily payment entry created', {
            id: dailyPayment._id,
            millId,
            userId,
        })

        return dailyPayment
    } catch (error) {
        logger.error('Failed to create daily payment entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily payment entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Daily payment ID
 * @returns {Promise<object>} Daily payment entry
 */
export const getDailyPaymentById = async (millId, id) => {
    try {
        const dailyPayment = await DailyPayment.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyPayment) {
            const error = new Error('Daily payment entry not found')
            error.statusCode = 404
            throw error
        }

        return dailyPayment
    } catch (error) {
        logger.error('Failed to get daily payment entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily payment list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated daily payment list
 */
export const getDailyPaymentList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            paymentMode,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (status) {
            matchStage.status = status
        }

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
                { voucherNumber: { $regex: search, $options: 'i' } },
                { purpose: { $regex: search, $options: 'i' } },
                { referenceNumber: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = DailyPayment.aggregate([
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
        const result = await DailyPayment.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get daily payment list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get daily payment summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getDailyPaymentSummary = async (millId, options = {}) => {
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

        const [summary] = await DailyPayment.aggregate([
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
                    // Status counts
                    pendingCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
                        },
                    },
                    completedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
                        },
                    },
                    cancelledCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0],
                        },
                    },
                    failedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'failed'] }, 1, 0],
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
                    statusCounts: {
                        pending: '$pendingCount',
                        completed: '$completedCount',
                        cancelled: '$cancelledCount',
                        failed: '$failedCount',
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
                statusCounts: {
                    pending: 0,
                    completed: 0,
                    cancelled: 0,
                    failed: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get daily payment summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a daily payment entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily payment ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated daily payment entry
 */
export const updateDailyPaymentEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const dailyPayment = await DailyPayment.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!dailyPayment) {
            const error = new Error('Daily payment entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily payment entry updated', {
            id,
            millId,
            userId,
        })

        return dailyPayment
    } catch (error) {
        logger.error('Failed to update daily payment entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a daily payment entry
 * @param {string} millId - Mill ID
 * @param {string} id - Daily payment ID
 * @returns {Promise<void>}
 */
export const deleteDailyPaymentEntry = async (millId, id) => {
    try {
        const dailyPayment = await DailyPayment.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!dailyPayment) {
            const error = new Error('Daily payment entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Daily payment entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete daily payment entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete daily payment entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of daily payment IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteDailyPaymentEntries = async (millId, ids) => {
    try {
        const result = await DailyPayment.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Daily payment entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete daily payment entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
