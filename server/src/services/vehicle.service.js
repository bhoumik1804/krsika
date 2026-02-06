import mongoose from 'mongoose'
import { Vehicle } from '../models/vehicle.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createVehicleEntry = async (millId, data, userId) => {
    const vehicle = new Vehicle({ ...data, millId, createdBy: userId })
    await vehicle.save()
    logger.info('Vehicle created', { id: vehicle._id, millId, userId })
    return vehicle
}

export const getVehicleById = async (millId, id) => {
    const vehicle = await Vehicle.findOne({ _id: id, millId })
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!vehicle) throw new ApiError(404, 'Vehicle not found')
    return vehicle
}

export const getVehicleList = async (millId, options = {}) => {
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
        ]
    }

    const aggregate = Vehicle.aggregate([
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
}

export const getVehicleSummary = async (millId) => {
    const [summary] = await Vehicle.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalVehicles: { $sum: 1 } } },
        { $project: { _id: 0, totalVehicles: 1 } },
    ])
    return summary || { totalVehicles: 0 }
}

export const updateVehicleEntry = async (millId, id, data, userId) => {
    const vehicle = await Vehicle.findOneAndUpdate(
        { _id: id, millId },
        { ...data, updatedBy: userId },
        { new: true, runValidators: true }
    )
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')

    if (!vehicle) throw new ApiError(404, 'Vehicle not found')
    logger.info('Vehicle updated', { id, millId, userId })
    return vehicle
}

export const deleteVehicleEntry = async (millId, id) => {
    const vehicle = await Vehicle.findOneAndDelete({ _id: id, millId })
    if (!vehicle) throw new ApiError(404, 'Vehicle not found')
    logger.info('Vehicle deleted', { id, millId })
}

export const bulkDeleteVehicleEntries = async (millId, ids) => {
    const result = await Vehicle.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Vehicles bulk deleted', { millId, count: result.deletedCount })
    return result.deletedCount
}
