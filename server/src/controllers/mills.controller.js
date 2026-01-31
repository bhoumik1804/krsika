import {
    createMillEntry,
    getMillById,
    getMillsList,
    getMillsSummary,
    updateMillEntry,
    verifyMillEntry,
    suspendMillEntry,
    reactivateMillEntry,
    deleteMillEntry,
    bulkDeleteMillEntries,
} from '../services/mills.service.js'

/**
 * Mills Controller (Super Admin)
 * HTTP request handlers for mills endpoints
 */

/**
 * Create a new mill
 * POST /api/admin/mills
 */
export const createMill = async (req, res, next) => {
    try {
        const userId = req.user._id

        const mill = await createMillEntry(req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: mill,
            message: 'Mill created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get mill by ID
 * GET /api/admin/mills/:id
 */
export const getMillByIdHandler = async (req, res, next) => {
    try {
        const { id } = req.params

        const mill = await getMillById(id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: mill,
            message: 'Mill retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get mills list with pagination
 * GET /api/admin/mills
 */
export const getMillsListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, status, sortBy, sortOrder } = req.query

        const result = await getMillsList({
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Mills list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get mills summary statistics
 * GET /api/admin/mills/summary
 */
export const getMillsSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getMillsSummary()

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Mills summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a mill
 * PUT /api/admin/mills/:id
 */
export const updateMillHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const mill = await updateMillEntry(id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: mill,
            message: 'Mill updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Verify a mill (approve or reject)
 * PATCH /api/admin/mills/:id/verify
 */
export const verifyMillHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status, rejectionReason } = req.body
        const userId = req.user._id

        const mill = await verifyMillEntry(id, status, rejectionReason, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: mill,
            message:
                status === 'ACTIVE'
                    ? 'Mill approved successfully'
                    : 'Mill rejected',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Suspend a mill
 * PATCH /api/admin/mills/:id/suspend
 */
export const suspendMillHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const mill = await suspendMillEntry(id, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: mill,
            message: 'Mill suspended successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Reactivate a suspended mill
 * PATCH /api/admin/mills/:id/reactivate
 */
export const reactivateMillHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const mill = await reactivateMillEntry(id, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: mill,
            message: 'Mill reactivated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a mill
 * DELETE /api/admin/mills/:id
 */
export const deleteMillHandler = async (req, res, next) => {
    try {
        const { id } = req.params

        await deleteMillEntry(id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Mill deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete mills
 * DELETE /api/admin/mills/bulk
 */
export const bulkDeleteMillsHandler = async (req, res, next) => {
    try {
        const { ids } = req.body

        const deletedCount = await bulkDeleteMillEntries(ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} mills deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
