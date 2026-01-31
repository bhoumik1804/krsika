import mongoose from 'mongoose'
import { Transporter } from '../models/transporter.model.js'
import logger from '../utils/logger.js'

/**
 * Transporter Service
 * Business logic for transporter operations
 */

/**
 * Create a new transporter
 */
export const createTransporterEntry = async (millId, data, userId) => {
    try {
        const transporter = new Transporter({
            ...data,
            millId,
            createdBy: userId,
        })

        await transporter.save()

        logger.info('Transporter created', {
            id: transporter._id,
            millId,
            userId,
        })

        return transporter
    } catch (error) {
        logger.error('Failed to create transporter', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get transporter by ID
 */
export const getTransporterById = async (millId, id) => {
    try {
        const transporter = await Transporter.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!transporter) {
            const error = new Error('Transporter not found')
            error.statusCode = 404
            throw error
        }

        return transporter
    } catch (error) {
        logger.error('Failed to get transporter', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get transporter list with pagination and filters
 */
export const getTransporterList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'transporterName',
            sortOrder = 'asc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            matchStage.$or = [
                { transporterName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = Transporter.aggregate([
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

        const result = await Transporter.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get transporter list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get transporter summary statistics
 */
export const getTransporterSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await Transporter.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalTransporters: { $sum: 1 },
                    totalVehicles: { $sum: { $ifNull: ['$vehicleCount', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalTransporters: 1,
                    totalVehicles: 1,
                },
            },
        ])

        return (
            summary || {
                totalTransporters: 0,
                totalVehicles: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get transporter summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a transporter
 */
export const updateTransporterEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const transporter = await Transporter.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!transporter) {
            const error = new Error('Transporter not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Transporter updated', {
            id,
            millId,
            userId,
        })

        return transporter
    } catch (error) {
        logger.error('Failed to update transporter', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a transporter
 */
export const deleteTransporterEntry = async (millId, id) => {
    try {
        const transporter = await Transporter.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!transporter) {
            const error = new Error('Transporter not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Transporter deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete transporter', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete transporters
 */
export const bulkDeleteTransporterEntries = async (millId, ids) => {
    try {
        const result = await Transporter.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Transporters bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete transporters', {
            millId,
            error: error.message,
        })
        throw error
    }
}
