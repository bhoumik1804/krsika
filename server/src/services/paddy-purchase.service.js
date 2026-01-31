import mongoose from 'mongoose'
import { PaddyPurchase } from '../models/paddy-purchase.model.js'
import logger from '../utils/logger.js'

/**
 * Paddy Purchase Service
 * Business logic for paddy purchase operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new paddy purchase entry
 * @param {string} millId - Mill ID
 * @param {object} data - Paddy purchase data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created paddy purchase entry
 */
export const createPaddyPurchaseEntry = async (millId, data, userId) => {
    try {
        const paddyPurchase = new PaddyPurchase({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await paddyPurchase.save()

        logger.info('Paddy purchase entry created', {
            id: paddyPurchase._id,
            millId,
            userId,
        })

        return paddyPurchase
    } catch (error) {
        logger.error('Failed to create paddy purchase entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get paddy purchase entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Paddy purchase ID
 * @returns {Promise<object>} Paddy purchase entry
 */
export const getPaddyPurchaseById = async (millId, id) => {
    try {
        const paddyPurchase = await PaddyPurchase.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!paddyPurchase) {
            const error = new Error('Paddy purchase entry not found')
            error.statusCode = 404
            throw error
        }

        return paddyPurchase
    } catch (error) {
        logger.error('Failed to get paddy purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get paddy purchase list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated paddy purchase list
 */
export const getPaddyPurchaseList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            purchaseType,
            deliveryType,
            paddyType,
            partyName,
            brokerName,
            committeeName,
            gunnyType,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (purchaseType) {
            matchStage.purchaseType = { $regex: purchaseType, $options: 'i' }
        }

        if (deliveryType) {
            matchStage.deliveryType = { $regex: deliveryType, $options: 'i' }
        }

        if (paddyType) {
            matchStage.paddyType = { $regex: paddyType, $options: 'i' }
        }

        if (partyName) {
            matchStage.partyName = { $regex: partyName, $options: 'i' }
        }

        if (brokerName) {
            matchStage.brokerName = { $regex: brokerName, $options: 'i' }
        }

        if (committeeName) {
            matchStage.committeeName = { $regex: committeeName, $options: 'i' }
        }

        if (gunnyType) {
            matchStage.gunnyType = { $regex: gunnyType, $options: 'i' }
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
                { brokerName: { $regex: search, $options: 'i' } },
                { doNumber: { $regex: search, $options: 'i' } },
                { committeeName: { $regex: search, $options: 'i' } },
                { paddyType: { $regex: search, $options: 'i' } },
                { purchaseType: { $regex: search, $options: 'i' } },
                { deliveryType: { $regex: search, $options: 'i' } },
                { gunnyType: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = PaddyPurchase.aggregate([
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
        const result = await PaddyPurchase.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get paddy purchase list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get paddy purchase summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getPaddyPurchaseSummary = async (millId, options = {}) => {
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

        const [summary] = await PaddyPurchase.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalDoPaddyQty: { $sum: { $ifNull: ['$doPaddyQty', 0] } },
                    totalPaddyQty: { $sum: { $ifNull: ['$totalPaddyQty', 0] } },
                    totalBrokerage: { $sum: { $ifNull: ['$brokerage', 0] } },
                    avgPaddyRatePerQuintal: {
                        $avg: { $ifNull: ['$paddyRatePerQuintal', 0] },
                    },
                    avgDiscountPercent: {
                        $avg: { $ifNull: ['$discountPercent', 0] },
                    },
                    totalNewGunnyRate: {
                        $sum: { $ifNull: ['$newGunnyRate', 0] },
                    },
                    totalOldGunnyRate: {
                        $sum: { $ifNull: ['$oldGunnyRate', 0] },
                    },
                    totalPlasticGunnyRate: {
                        $sum: { $ifNull: ['$plasticGunnyRate', 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalDoPaddyQty: { $round: ['$totalDoPaddyQty', 2] },
                    totalPaddyQty: { $round: ['$totalPaddyQty', 2] },
                    totalBrokerage: { $round: ['$totalBrokerage', 2] },
                    avgPaddyRatePerQuintal: {
                        $round: ['$avgPaddyRatePerQuintal', 2],
                    },
                    avgDiscountPercent: {
                        $round: ['$avgDiscountPercent', 2],
                    },
                    totalNewGunnyRate: { $round: ['$totalNewGunnyRate', 2] },
                    totalOldGunnyRate: { $round: ['$totalOldGunnyRate', 2] },
                    totalPlasticGunnyRate: {
                        $round: ['$totalPlasticGunnyRate', 2],
                    },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalDoPaddyQty: 0,
                totalPaddyQty: 0,
                totalBrokerage: 0,
                avgPaddyRatePerQuintal: 0,
                avgDiscountPercent: 0,
                totalNewGunnyRate: 0,
                totalOldGunnyRate: 0,
                totalPlasticGunnyRate: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get paddy purchase summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a paddy purchase entry
 * @param {string} millId - Mill ID
 * @param {string} id - Paddy purchase ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated paddy purchase entry
 */
export const updatePaddyPurchaseEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const paddyPurchase = await PaddyPurchase.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!paddyPurchase) {
            const error = new Error('Paddy purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Paddy purchase entry updated', {
            id,
            millId,
            userId,
        })

        return paddyPurchase
    } catch (error) {
        logger.error('Failed to update paddy purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a paddy purchase entry
 * @param {string} millId - Mill ID
 * @param {string} id - Paddy purchase ID
 * @returns {Promise<void>}
 */
export const deletePaddyPurchaseEntry = async (millId, id) => {
    try {
        const paddyPurchase = await PaddyPurchase.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!paddyPurchase) {
            const error = new Error('Paddy purchase entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Paddy purchase entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete paddy purchase entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete paddy purchase entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of paddy purchase IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeletePaddyPurchaseEntries = async (millId, ids) => {
    try {
        const result = await PaddyPurchase.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Paddy purchase entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete paddy purchase entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
