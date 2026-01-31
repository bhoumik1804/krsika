import {
    createFrkPurchaseEntry,
    getFrkPurchaseById,
    getFrkPurchaseList,
    getFrkPurchaseSummary,
    updateFrkPurchaseEntry,
    deleteFrkPurchaseEntry,
    bulkDeleteFrkPurchaseEntries,
} from '../services/frk-purchase.service.js'

/**
 * FRK Purchase Controller
 * HTTP request handlers for FRK purchase endpoints
 */

/**
 * Create a new FRK purchase entry
 * POST /api/mills/:millId/frk-purchase
 */
export const createFrkPurchase = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const frkPurchase = await createFrkPurchaseEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: frkPurchase,
            message: 'FRK purchase entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK purchase entry by ID
 * GET /api/mills/:millId/frk-purchase/:id
 */
export const getFrkPurchaseByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const frkPurchase = await getFrkPurchaseById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: frkPurchase,
            message: 'FRK purchase entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK purchase list with pagination
 * GET /api/mills/:millId/frk-purchase
 */
export const getFrkPurchaseListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getFrkPurchaseList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'FRK purchase list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK purchase summary statistics
 * GET /api/mills/:millId/frk-purchase/summary
 */
export const getFrkPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getFrkPurchaseSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'FRK purchase summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a FRK purchase entry
 * PUT /api/mills/:millId/frk-purchase/:id
 */
export const updateFrkPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const frkPurchase = await updateFrkPurchaseEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: frkPurchase,
            message: 'FRK purchase entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a FRK purchase entry
 * DELETE /api/mills/:millId/frk-purchase/:id
 */
export const deleteFrkPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteFrkPurchaseEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'FRK purchase entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete FRK purchase entries
 * DELETE /api/mills/:millId/frk-purchase/bulk
 */
export const bulkDeleteFrkPurchaseHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteFrkPurchaseEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} FRK purchase entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
