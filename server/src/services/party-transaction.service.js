import mongoose from 'mongoose'
import { PartyTransaction } from '../models/party-transaction.model.js'
import logger from '../utils/logger.js'

/**
 * Party Transaction Service
 * Business logic for party transaction operations
 */

/**
 * Create a new party transaction entry
 * @param {string} millId - Mill ID
 * @param {object} data - Party transaction data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created party transaction entry
 */
export const createPartyTransactionEntry = async (millId, data, userId) => {
    try {
        const partyTransaction = new PartyTransaction({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await partyTransaction.save()

        logger.info('Party transaction entry created', {
            id: partyTransaction._id,
            millId,
            userId,
        })

        return partyTransaction
    } catch (error) {
        logger.error('Failed to create party transaction entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get party transaction entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Party transaction ID
 * @returns {Promise<object>} Party transaction entry
 */
export const getPartyTransactionById = async (millId, id) => {
    try {
        const partyTransaction = await PartyTransaction.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!partyTransaction) {
            const error = new Error('Party transaction entry not found')
            error.statusCode = 404
            throw error
        }

        return partyTransaction
    } catch (error) {
        logger.error('Failed to get party transaction entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get party transaction list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated party transaction list
 */
export const getPartyTransactionList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            transactionType,
            partyName,
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

        if (partyName) {
            matchStage.partyName = { $regex: partyName, $options: 'i' }
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
                { transactionType: { $regex: search, $options: 'i' } },
                { narration: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = PartyTransaction.aggregate([
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
        const result = await PartyTransaction.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get party transaction list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get party transaction summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate, partyName)
 * @returns {Promise<object>} Summary statistics
 */
export const getPartyTransactionSummary = async (millId, options = {}) => {
    try {
        const { startDate, endDate, partyName } = options

        // Build match stage
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        if (partyName) {
            match.partyName = { $regex: partyName, $options: 'i' }
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

        const [summary] = await PartyTransaction.aggregate([
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
        logger.error('Failed to get party transaction summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a party transaction entry
 * @param {string} millId - Mill ID
 * @param {string} id - Party transaction ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated party transaction entry
 */
export const updatePartyTransactionEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const partyTransaction = await PartyTransaction.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!partyTransaction) {
            const error = new Error('Party transaction entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Party transaction entry updated', {
            id,
            millId,
            userId,
        })

        return partyTransaction
    } catch (error) {
        logger.error('Failed to update party transaction entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a party transaction entry
 * @param {string} millId - Mill ID
 * @param {string} id - Party transaction ID
 * @returns {Promise<void>}
 */
export const deletePartyTransactionEntry = async (millId, id) => {
    try {
        const partyTransaction = await PartyTransaction.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!partyTransaction) {
            const error = new Error('Party transaction entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Party transaction entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete party transaction entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete party transaction entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of party transaction IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeletePartyTransactionEntries = async (millId, ids) => {
    try {
        const result = await PartyTransaction.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Party transaction entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete party transaction entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
