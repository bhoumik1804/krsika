import {
    createGunnyPurchaseEntry,
    getGunnyPurchaseById,
    getGunnyPurchaseList,
    getGunnyPurchaseSummary,
    updateGunnyPurchaseEntry,
    deleteGunnyPurchaseEntry,
    bulkDeleteGunnyPurchaseEntries,
} from '../services/gunny-purchase.service.js'

/**
 * Gunny Purchase Controller
 * HTTP request handlers for gunny purchase endpoints
 */

/**
 * Create a new gunny purchase entry
 * POST /api/mills/:millId/gunny-purchase
 */
export const createGunnyPurchase = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const gunnyPurchase = await createGunnyPurchaseEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: gunnyPurchase,
            message: 'Gunny purchase entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny purchase entry by ID
 * GET /api/mills/:millId/gunny-purchase/:id
 */
export const getGunnyPurchaseByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const gunnyPurchase = await getGunnyPurchaseById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: gunnyPurchase,
            message: 'Gunny purchase entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny purchase list with pagination
 * GET /api/mills/:millId/gunny-purchase
 */
export const getGunnyPurchaseListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getGunnyPurchaseList(millId, {
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
            message: 'Gunny purchase list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny purchase summary statistics
 * GET /api/mills/:millId/gunny-purchase/summary
 */
export const getGunnyPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getGunnyPurchaseSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Gunny purchase summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a gunny purchase entry
 * PUT /api/mills/:millId/gunny-purchase/:id
 */
export const updateGunnyPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const gunnyPurchase = await updateGunnyPurchaseEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: gunnyPurchase,
            message: 'Gunny purchase entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a gunny purchase entry
 * DELETE /api/mills/:millId/gunny-purchase/:id
 */
export const deleteGunnyPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteGunnyPurchaseEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Gunny purchase entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete gunny purchase entries
 * DELETE /api/mills/:millId/gunny-purchase/bulk
 */
export const bulkDeleteGunnyPurchaseHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteGunnyPurchaseEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} gunny purchase entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
