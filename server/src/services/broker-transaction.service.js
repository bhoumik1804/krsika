import mongoose from 'mongoose'
import { BrokerTransaction } from '../models/broker-transaction.model.js'
import logger from '../utils/logger.js'

/**
 * Broker Transaction Service
 * Business logic for broker transaction operations
 */

/**
 * Create a new broker transaction entry
 * @param {string} millId - Mill ID
 * @param {object} data - Broker transaction data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created broker transaction entry
 */
export const createBrokerTransactionEntry = async (millId, data, userId) => {
    try {
        const brokerTransaction = new BrokerTransaction({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await brokerTransaction.save()

        logger.info('Broker transaction entry created', {
            id: brokerTransaction._id,
            millId,
            userId,
        })

        return brokerTransaction
    } catch (error) {
        logger.error('Failed to create broker transaction entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get broker transaction entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Broker transaction ID
 * @returns {Promise<object>} Broker transaction entry
 */
export const getBrokerTransactionById = async (millId, id) => {
    try {
        const brokerTransaction = await BrokerTransaction.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!brokerTransaction) {
            const error = new Error('Broker transaction entry not found')
            error.statusCode = 404
            throw error
        }

        return brokerTransaction
    } catch (error) {
        logger.error('Failed to get broker transaction entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get broker transaction list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated broker transaction list
 */
export const getBrokerTransactionList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            transactionType,
            brokerName,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (transactionType) {
            matchStage.transactionType = transactionType
        }

        if (brokerName) {
            matchStage.brokerName = { $regex: brokerName, $options: 'i' }
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
                { brokerName: { $regex: search, $options: 'i' } },
                { transactionType: { $regex: search, $options: 'i' } },
                { narration: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = BrokerTransaction.aggregate([
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
        const result = await BrokerTransaction.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get broker transaction list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get broker transaction summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate, brokerName)
 * @returns {Promise<object>} Summary statistics
 */
export const getBrokerTransactionSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate, brokerName } = options

        // Build match stage
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        if (brokerName) {
            match.brokerName = { $regex: brokerName, $options: 'i' }
        }

        if (startDate || endDate) {
            match.date = {}
            if (startDate) {
                match.date.$gte = new Date(startDate)
            }
            if (endDate) {
                match.date.$lte = new Date(endDate + 'T23:59:59.999Z')
            }
        }

        const [summary] = await BrokerTransaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalDebit: { $sum: { $ifNull: ['$debit', 0] } },
                    totalCredit: { $sum: { $ifNull: ['$credit', 0] } },
                    debitCount: {
                        $sum: {
                            $cond: [{ $gt: ['$debit', 0] }, 1, 0],
                        },
                    },
                    creditCount: {
                        $sum: {
                            $cond: [{ $gt: ['$credit', 0] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalDebit: { $round: ['$totalDebit', 2] },
                    totalCredit: { $round: ['$totalCredit', 2] },
                    netBalance: {
                        $round: [
                            { $subtract: ['$totalDebit', '$totalCredit'] },
                            2,
                        ],
                    },
                    transactionTypeCounts: {
                        debit: '$debitCount',
                        credit: '$creditCount',
                    },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalDebit: 0,
                totalCredit: 0,
                netBalance: 0,
                transactionTypeCounts: {
                    debit: 0,
                    credit: 0,
                },
            }
        )
    } catch (error) {
        logger.error('Failed to get broker transaction summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a broker transaction entry
 * @param {string} millId - Mill ID
 * @param {string} id - Broker transaction ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated broker transaction entry
 */
export const updateBrokerTransactionEntry = async (
    millId,
    id,
    data,
    userId
) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const brokerTransaction = await BrokerTransaction.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!brokerTransaction) {
            const error = new Error('Broker transaction entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Broker transaction entry updated', {
            id,
            millId,
            userId,
        })

        return brokerTransaction
    } catch (error) {
        logger.error('Failed to update broker transaction entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a broker transaction entry
 * @param {string} millId - Mill ID
 * @param {string} id - Broker transaction ID
 * @returns {Promise<void>}
 */
export const deleteBrokerTransactionEntry = async (millId, id) => {
    try {
        const brokerTransaction = await BrokerTransaction.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!brokerTransaction) {
            const error = new Error('Broker transaction entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Broker transaction entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete broker transaction entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete broker transaction entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of broker transaction IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteBrokerTransactionEntries = async (millId, ids) => {
    try {
        const result = await BrokerTransaction.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Broker transaction entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete broker transaction entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
