import {
    createOtherPurchaseEntry,
    getOtherPurchaseById,
    getOtherPurchaseList,
    getOtherPurchaseSummary,
    updateOtherPurchaseEntry,
    deleteOtherPurchaseEntry,
    bulkDeleteOtherPurchaseEntries,
} from '../services/other-purchase.service.js'

/**
 * Other Purchase Controller
 * HTTP request handlers for other purchase endpoints
 */

/**
 * Create a new other purchase entry
 * POST /api/mills/:millId/other-purchase
 */
export const createOtherPurchase = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const otherPurchase = await createOtherPurchaseEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: otherPurchase,
            message: 'Other purchase entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other purchase entry by ID
 * GET /api/mills/:millId/other-purchase/:id
 */
export const getOtherPurchaseByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const otherPurchase = await getOtherPurchaseById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: otherPurchase,
            message: 'Other purchase entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other purchase list with pagination
 * GET /api/mills/:millId/other-purchase
 */
export const getOtherPurchaseListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getOtherPurchaseList(millId, {
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
            message: 'Other purchase list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other purchase summary statistics
 * GET /api/mills/:millId/other-purchase/summary
 */
export const getOtherPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getOtherPurchaseSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Other purchase summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a other purchase entry
 * PUT /api/mills/:millId/other-purchase/:id
 */
export const updateOtherPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const otherPurchase = await updateOtherPurchaseEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: otherPurchase,
            message: 'Other purchase entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a other purchase entry
 * DELETE /api/mills/:millId/other-purchase/:id
 */
export const deleteOtherPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteOtherPurchaseEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Other purchase entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete other purchase entries
 * DELETE /api/mills/:millId/other-purchase/bulk
 */
export const bulkDeleteOtherPurchaseHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteOtherPurchaseEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} other purchase entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
