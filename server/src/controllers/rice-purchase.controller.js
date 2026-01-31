import {
    createRicePurchaseEntry,
    getRicePurchaseById,
    getRicePurchaseList,
    getRicePurchaseSummary,
    updateRicePurchaseEntry,
    deleteRicePurchaseEntry,
    bulkDeleteRicePurchaseEntries,
} from '../services/rice-purchase.service.js'

/**
 * Rice Purchase Controller
 * HTTP request handlers for rice purchase endpoints
 */

/**
 * Create a new rice purchase entry
 * POST /api/mills/:millId/rice-purchase
 */
export const createRicePurchase = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const ricePurchase = await createRicePurchaseEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: ricePurchase,
            message: 'Rice purchase entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice purchase entry by ID
 * GET /api/mills/:millId/rice-purchase/:id
 */
export const getRicePurchaseByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const ricePurchase = await getRicePurchaseById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: ricePurchase,
            message: 'Rice purchase entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice purchase list with pagination
 * GET /api/mills/:millId/rice-purchase
 */
export const getRicePurchaseListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getRicePurchaseList(millId, {
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
            message: 'Rice purchase list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice purchase summary statistics
 * GET /api/mills/:millId/rice-purchase/summary
 */
export const getRicePurchaseSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getRicePurchaseSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Rice purchase summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a rice purchase entry
 * PUT /api/mills/:millId/rice-purchase/:id
 */
export const updateRicePurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const ricePurchase = await updateRicePurchaseEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: ricePurchase,
            message: 'Rice purchase entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a rice purchase entry
 * DELETE /api/mills/:millId/rice-purchase/:id
 */
export const deleteRicePurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteRicePurchaseEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Rice purchase entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete rice purchase entries
 * DELETE /api/mills/:millId/rice-purchase/bulk
 */
export const bulkDeleteRicePurchaseHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteRicePurchaseEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} rice purchase entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
