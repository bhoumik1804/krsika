import {
    createPaddyPurchaseEntry,
    getPaddyPurchaseById,
    getPaddyPurchaseList,
    getPaddyPurchaseSummary,
    updatePaddyPurchaseEntry,
    deletePaddyPurchaseEntry,
    bulkDeletePaddyPurchaseEntries,
} from '../services/paddy-purchase.service.js'

/**
 * Paddy Purchase Controller
 * HTTP request handlers for paddy purchase endpoints
 */

/**
 * Create a new paddy purchase entry
 * POST /api/mills/:millId/paddy-purchase
 */
export const createPaddyPurchase = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const paddyPurchase = await createPaddyPurchaseEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: paddyPurchase,
            message: 'Paddy purchase entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get paddy purchase entry by ID
 * GET /api/mills/:millId/paddy-purchase/:id
 */
export const getPaddyPurchaseByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const paddyPurchase = await getPaddyPurchaseById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: paddyPurchase,
            message: 'Paddy purchase entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get paddy purchase list with pagination
 * GET /api/mills/:millId/paddy-purchase
 */
export const getPaddyPurchaseListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            purchaseType,
            deliveryType,
            paddyType,
            partyName,
            brokerName,
            committeeName,
            gunnyType,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getPaddyPurchaseList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            purchaseType,
            deliveryType,
            paddyType,
            partyName,
            brokerName,
            committeeName,
            gunnyType,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Paddy purchase list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get paddy purchase summary statistics
 * GET /api/mills/:millId/paddy-purchase/summary
 */
export const getPaddyPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getPaddyPurchaseSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Paddy purchase summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a paddy purchase entry
 * PUT /api/mills/:millId/paddy-purchase/:id
 */
export const updatePaddyPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const paddyPurchase = await updatePaddyPurchaseEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: paddyPurchase,
            message: 'Paddy purchase entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a paddy purchase entry
 * DELETE /api/mills/:millId/paddy-purchase/:id
 */
export const deletePaddyPurchaseHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deletePaddyPurchaseEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Paddy purchase entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete paddy purchase entries
 * DELETE /api/mills/:millId/paddy-purchase/bulk
 */
export const bulkDeletePaddyPurchaseHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeletePaddyPurchaseEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} paddy purchase entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
