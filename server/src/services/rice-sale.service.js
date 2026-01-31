import mongoose from 'mongoose'
import { RiceSale } from '../models/rice-sale.model.js'
import logger from '../utils/logger.js'

/**
 * Rice Sale Service
 * Business logic for rice sale operations
 *
 * Performance Notes:
 * - Search functionality uses $regex which may require optimization for large datasets.
 *   Consider implementing MongoDB text indexes if search performance becomes critical.
 * - Summary aggregation benefits from existing indexes but may need monitoring under load.
 *   Consider pre-aggregation strategies for frequently accessed summaries if needed.
 */

/**
 * Create a new rice sale entry
 * @param {string} millId - Mill ID
 * @param {object} data - Rice sale data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created rice sale entry
 */
export const createRiceSaleEntry = async (millId, data, userId) => {
    try {
        const riceSale = new RiceSale({
            ...data,
            millId,
            createdBy: userId,
            date: new Date(data.date),
        })

        await riceSale.save()

        logger.info('Rice sale entry created', {
            id: riceSale._id,
            millId,
            userId,
        })

        return riceSale
    } catch (error) {
        logger.error('Failed to create rice sale entry', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice sale entry by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Rice sale ID
 * @returns {Promise<object>} Rice sale entry
 */
export const getRiceSaleById = async (millId, id) => {
    try {
        const riceSale = await RiceSale.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!riceSale) {
            const error = new Error('Rice sale entry not found')
            error.statusCode = 404
            throw error
        }

        return riceSale
    } catch (error) {
        logger.error('Failed to get rice sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice sale list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated rice sale list
 */
export const getRiceSaleList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            partyName,
            brokerName,
            deliveryType,
            lotOrOther,
            fciOrNAN,
            riceType,
            gunnyType,
            frkType,
            lotNumber,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (partyName) {
            matchStage.partyName = { $regex: partyName, $options: 'i' }
        }

        if (brokerName) {
            matchStage.brokerName = { $regex: brokerName, $options: 'i' }
        }

        if (deliveryType) {
            matchStage.deliveryType = { $regex: deliveryType, $options: 'i' }
        }

        if (lotOrOther) {
            matchStage.lotOrOther = { $regex: lotOrOther, $options: 'i' }
        }

        if (fciOrNAN) {
            matchStage.fciOrNAN = { $regex: fciOrNAN, $options: 'i' }
        }

        if (riceType) {
            matchStage.riceType = { $regex: riceType, $options: 'i' }
        }

        if (gunnyType) {
            matchStage.gunnyType = { $regex: gunnyType, $options: 'i' }
        }

        if (frkType) {
            matchStage.frkType = { $regex: frkType, $options: 'i' }
        }

        if (lotNumber) {
            matchStage.lotNumber = { $regex: lotNumber, $options: 'i' }
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
                { riceType: { $regex: search, $options: 'i' } },
                { deliveryType: { $regex: search, $options: 'i' } },
                { lotOrOther: { $regex: search, $options: 'i' } },
                { fciOrNAN: { $regex: search, $options: 'i' } },
                { gunnyType: { $regex: search, $options: 'i' } },
                { frkType: { $regex: search, $options: 'i' } },
                { lotNumber: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = RiceSale.aggregate([
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
        const result = await RiceSale.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get rice sale list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get rice sale summary statistics
 * @param {string} millId - Mill ID
 * @param {object} options - Query options (startDate, endDate)
 * @returns {Promise<object>} Summary statistics
 */
export const getRiceSaleSummary = async (millId, options = {}) => {
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

        const [summary] = await RiceSale.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalEntries: { $sum: 1 },
                    totalRiceQty: { $sum: { $ifNull: ['$riceQty', 0] } },
                    totalBrokerage: {
                        $sum: { $ifNull: ['$brokeragePerQuintal', 0] },
                    },
                    avgRiceRatePerQuintal: {
                        $avg: { $ifNull: ['$riceRatePerQuintal', 0] },
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
                    totalFrkRatePerQuintal: {
                        $sum: { $ifNull: ['$frkRatePerQuintal', 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: 1,
                    totalRiceQty: { $round: ['$totalRiceQty', 2] },
                    totalBrokerage: { $round: ['$totalBrokerage', 2] },
                    avgRiceRatePerQuintal: {
                        $round: ['$avgRiceRatePerQuintal', 2],
                    },
                    avgDiscountPercent: {
                        $round: ['$avgDiscountPercent', 2],
                    },
                    totalNewGunnyRate: { $round: ['$totalNewGunnyRate', 2] },
                    totalOldGunnyRate: { $round: ['$totalOldGunnyRate', 2] },
                    totalPlasticGunnyRate: {
                        $round: ['$totalPlasticGunnyRate', 2],
                    },
                    totalFrkRatePerQuintal: {
                        $round: ['$totalFrkRatePerQuintal', 2],
                    },
                },
            },
        ])

        return (
            summary || {
                totalEntries: 0,
                totalRiceQty: 0,
                totalBrokerage: 0,
                avgRiceRatePerQuintal: 0,
                avgDiscountPercent: 0,
                totalNewGunnyRate: 0,
                totalOldGunnyRate: 0,
                totalPlasticGunnyRate: 0,
                totalFrkRatePerQuintal: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get rice sale summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a rice sale entry
 * @param {string} millId - Mill ID
 * @param {string} id - Rice sale ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated rice sale entry
 */
export const updateRiceSaleEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        if (data.date) {
            updateData.date = new Date(data.date)
        }

        const riceSale = await RiceSale.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!riceSale) {
            const error = new Error('Rice sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Rice sale entry updated', {
            id,
            millId,
            userId,
        })

        return riceSale
    } catch (error) {
        logger.error('Failed to update rice sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a rice sale entry
 * @param {string} millId - Mill ID
 * @param {string} id - Rice sale ID
 * @returns {Promise<void>}
 */
export const deleteRiceSaleEntry = async (millId, id) => {
    try {
        const riceSale = await RiceSale.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!riceSale) {
            const error = new Error('Rice sale entry not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Rice sale entry deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete rice sale entry', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete rice sale entries
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of rice sale IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteRiceSaleEntries = async (millId, ids) => {
    try {
        const result = await RiceSale.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Rice sale entries bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete rice sale entries', {
            millId,
            error: error.message,
        })
        throw error
    }
}
