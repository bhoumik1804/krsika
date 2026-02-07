import {
    createVehicleEntry,
    getVehicleById,
    getVehicleList,
    getVehicleSummary,
    updateVehicleEntry,
    deleteVehicleEntry,
    bulkDeleteVehicleEntries,
} from '../services/vehicle.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await createVehicleEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { vehicle }, 'Vehicle created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getVehicleByIdHandler = async (req, res, next) => {
    try {
        const vehicle = await getVehicleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { vehicle }, 'Vehicle retrieved successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getVehicleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getVehicleList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { vehicles: result.data, pagination: result.pagination },
                'Vehicle list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getVehicleSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getVehicleSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Vehicle summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateVehicleHandler = async (req, res, next) => {
    try {
        const vehicle = await updateVehicleEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { vehicle }, 'Vehicle updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteVehicleHandler = async (req, res, next) => {
    try {
        await deleteVehicleEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Vehicle deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteVehicleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteVehicleEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} vehicles deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
