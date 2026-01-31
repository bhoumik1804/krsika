import mongoose from 'mongoose'
import { Vehicle } from '../models/vehicle.model.js'
import logger from '../utils/logger.js'

/**
 * Vehicle Service
 * Business logic for vehicle operations
 */

/**
 * Create a new vehicle
 */
export const createVehicleEntry = async (millId, data, userId) => {
    try {
        const vehicle = new Vehicle({
            ...data,
            millId,
            createdBy: userId,
        })

        await vehicle.save()

        logger.info('Vehicle created', {
            id: vehicle._id,
            millId,
            userId,
        })

        return vehicle
    } catch (error) {
        logger.error('Failed to create vehicle', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (millId, id) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!vehicle) {
            const error = new Error('Vehicle not found')
            error.statusCode = 404
            throw error
        }

        return vehicle
    } catch (error) {
        logger.error('Failed to get vehicle', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get vehicle list with pagination and filters
 */
export const getVehicleList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'vehicleNumber',
            sortOrder = 'asc',
        } = options

        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (search) {
            matchStage.$or = [
                { vehicleNumber: { $regex: search, $options: 'i' } },
                { vehicleType: { $regex: search, $options: 'i' } },
                { transporterName: { $regex: search, $options: 'i' } },
                { driverName: { $regex: search, $options: 'i' } },
                { driverPhone: { $regex: search, $options: 'i' } },
            ]
        }

        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        const aggregate = Vehicle.aggregate([
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

        const result = await Vehicle.aggregatePaginate(aggregate, {
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
        logger.error('Failed to get vehicle list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get vehicle summary statistics
 */
export const getVehicleSummary = async (millId) => {
    try {
        const match = { millId: new mongoose.Types.ObjectId(millId) }

        const [summary] = await Vehicle.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalVehicles: { $sum: 1 },
                    totalCapacity: { $sum: { $ifNull: ['$capacity', 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalVehicles: 1,
                    totalCapacity: 1,
                },
            },
        ])

        return (
            summary || {
                totalVehicles: 0,
                totalCapacity: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get vehicle summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a vehicle
 */
export const updateVehicleEntry = async (millId, id, data, userId) => {
    try {
        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!vehicle) {
            const error = new Error('Vehicle not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Vehicle updated', {
            id,
            millId,
            userId,
        })

        return vehicle
    } catch (error) {
        logger.error('Failed to update vehicle', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a vehicle
 */
export const deleteVehicleEntry = async (millId, id) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!vehicle) {
            const error = new Error('Vehicle not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Vehicle deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete vehicle', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete vehicles
 */
export const bulkDeleteVehicleEntries = async (millId, ids) => {
    try {
        const result = await Vehicle.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Vehicles bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete vehicles', {
            millId,
            error: error.message,
        })
        throw error
    }
}
