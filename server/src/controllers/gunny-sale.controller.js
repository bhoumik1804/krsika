import {
    createGunnySaleEntry,
    getGunnySaleById,
    getGunnySaleList,
    getGunnySaleSummary,
    updateGunnySaleEntry,
    deleteGunnySaleEntry,
    bulkDeleteGunnySaleEntries,
} from '../services/gunny-sale.service.js'

/**
 * Gunny Sale Controller
 * HTTP request handlers for gunny sale endpoints
 */

/**
 * Create a new gunny sale entry
 * POST /api/mills/:millId/gunny-sales
 */
export const createGunnySale = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const gunnySale = await createGunnySaleEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: gunnySale,
            message: 'Gunny sale entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny sale entry by ID
 * GET /api/mills/:millId/gunny-sales/:id
 */
export const getGunnySaleByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const gunnySale = await getGunnySaleById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: gunnySale,
            message: 'Gunny sale entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny sale list with pagination
 * GET /api/mills/:millId/gunny-sales
 */
export const getGunnySaleListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getGunnySaleList(millId, {
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
            message: 'Gunny sale list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny sale summary statistics
 * GET /api/mills/:millId/gunny-sales/summary
 */
export const getGunnySaleSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getGunnySaleSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Gunny sale summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a gunny sale entry
 * PUT /api/mills/:millId/gunny-sales/:id
 */
export const updateGunnySaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const gunnySale = await updateGunnySaleEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: gunnySale,
            message: 'Gunny sale entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a gunny sale entry
 * DELETE /api/mills/:millId/gunny-sales/:id
 */
export const deleteGunnySaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteGunnySaleEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Gunny sale entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete gunny sale entries
 * DELETE /api/mills/:millId/gunny-sales/bulk
 */
export const bulkDeleteGunnySaleHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteGunnySaleEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} gunny sale entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
