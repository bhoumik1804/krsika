import {
    createVehicleEntry,
    getVehicleById,
    getVehicleList,
    getVehicleSummary,
    updateVehicleEntry,
    deleteVehicleEntry,
    bulkDeleteVehicleEntries,
} from '../services/vehicle.service.js'

/**
 * Vehicle Controller
 * HTTP request handlers for vehicle endpoints
 */

/**
 * Create a new vehicle
 * POST /api/mills/:millId/vehicles
 */
export const createVehicle = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const vehicle = await createVehicleEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: vehicle,
            message: 'Vehicle created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get vehicle by ID
 * GET /api/mills/:millId/vehicles/:id
 */
export const getVehicleByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const vehicle = await getVehicleById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: vehicle,
            message: 'Vehicle retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get vehicle list with pagination
 * GET /api/mills/:millId/vehicles
 */
export const getVehicleListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getVehicleList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Vehicle list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get vehicle summary statistics
 * GET /api/mills/:millId/vehicles/summary
 */
export const getVehicleSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getVehicleSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Vehicle summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a vehicle
 * PUT /api/mills/:millId/vehicles/:id
 */
export const updateVehicleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const vehicle = await updateVehicleEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: vehicle,
            message: 'Vehicle updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a vehicle
 * DELETE /api/mills/:millId/vehicles/:id
 */
export const deleteVehicleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteVehicleEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Vehicle deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete vehicles
 * DELETE /api/mills/:millId/vehicles/bulk
 */
export const bulkDeleteVehicleHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteVehicleEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} vehicles deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
