import {
    createMillingPaddyEntry,
    getMillingPaddyById,
    getMillingPaddyList,
    getMillingPaddySummary,
    updateMillingPaddyEntry,
    deleteMillingPaddyEntry,
    bulkDeleteMillingPaddyEntries,
} from '../services/milling-paddy.service.js'

/**
 * Milling Paddy Controller
 * HTTP request handlers for milling paddy endpoints
 */

/**
 * Create a new milling paddy entry
 * POST /api/mills/:millId/milling-paddy
 */
export const createMillingPaddy = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const millingPaddy = await createMillingPaddyEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: millingPaddy,
            message: 'Milling paddy entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get milling paddy entry by ID
 * GET /api/mills/:millId/milling-paddy/:id
 */
export const getMillingPaddyByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const millingPaddy = await getMillingPaddyById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: millingPaddy,
            message: 'Milling paddy entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get milling paddy list with pagination
 * GET /api/mills/:millId/milling-paddy
 */
export const getMillingPaddyListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            paddyType,
            riceType,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getMillingPaddyList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            paddyType,
            riceType,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Milling paddy list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get milling paddy summary statistics
 * GET /api/mills/:millId/milling-paddy/summary
 */
export const getMillingPaddySummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getMillingPaddySummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Milling paddy summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a milling paddy entry
 * PUT /api/mills/:millId/milling-paddy/:id
 */
export const updateMillingPaddyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const millingPaddy = await updateMillingPaddyEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: millingPaddy,
            message: 'Milling paddy entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a milling paddy entry
 * DELETE /api/mills/:millId/milling-paddy/:id
 */
export const deleteMillingPaddyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteMillingPaddyEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Milling paddy entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete milling paddy entries
 * DELETE /api/mills/:millId/milling-paddy/bulk
 */
export const bulkDeleteMillingPaddyHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const result = await bulkDeleteMillingPaddyEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: `${result.deletedCount} milling paddy entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
