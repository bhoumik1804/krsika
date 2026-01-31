import {
    createTransporterEntry,
    getTransporterById,
    getTransporterList,
    getTransporterSummary,
    updateTransporterEntry,
    deleteTransporterEntry,
    bulkDeleteTransporterEntries,
} from '../services/transporter.service.js'

/**
 * Transporter Controller
 * HTTP request handlers for transporter endpoints
 */

/**
 * Create a new transporter
 * POST /api/mills/:millId/transporters
 */
export const createTransporter = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const transporter = await createTransporterEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: transporter,
            message: 'Transporter created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get transporter by ID
 * GET /api/mills/:millId/transporters/:id
 */
export const getTransporterByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const transporter = await getTransporterById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: transporter,
            message: 'Transporter retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get transporter list with pagination
 * GET /api/mills/:millId/transporters
 */
export const getTransporterListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getTransporterList(millId, {
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
            message: 'Transporter list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get transporter summary statistics
 * GET /api/mills/:millId/transporters/summary
 */
export const getTransporterSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getTransporterSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Transporter summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a transporter
 * PUT /api/mills/:millId/transporters/:id
 */
export const updateTransporterHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const transporter = await updateTransporterEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: transporter,
            message: 'Transporter updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a transporter
 * DELETE /api/mills/:millId/transporters/:id
 */
export const deleteTransporterHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteTransporterEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Transporter deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete transporters
 * DELETE /api/mills/:millId/transporters/bulk
 */
export const bulkDeleteTransporterHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteTransporterEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} transporters deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
