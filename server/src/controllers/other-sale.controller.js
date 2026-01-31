import {
    createOtherSaleEntry,
    getOtherSaleById,
    getOtherSaleList,
    getOtherSaleSummary,
    updateOtherSaleEntry,
    deleteOtherSaleEntry,
    bulkDeleteOtherSaleEntries,
} from '../services/other-sale.service.js'

/**
 * Other Sale Controller
 * HTTP request handlers for other sale endpoints
 */

/**
 * Create a new other sale entry
 * POST /api/mills/:millId/other-sales
 */
export const createOtherSale = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const otherSale = await createOtherSaleEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: otherSale,
            message: 'Other sale entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other sale entry by ID
 * GET /api/mills/:millId/other-sales/:id
 */
export const getOtherSaleByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const otherSale = await getOtherSaleById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: otherSale,
            message: 'Other sale entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other sale list with pagination
 * GET /api/mills/:millId/other-sales
 */
export const getOtherSaleListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getOtherSaleList(millId, {
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
            message: 'Other sale list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other sale summary statistics
 * GET /api/mills/:millId/other-sales/summary
 */
export const getOtherSaleSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getOtherSaleSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Other sale summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update an other sale entry
 * PUT /api/mills/:millId/other-sales/:id
 */
export const updateOtherSaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const otherSale = await updateOtherSaleEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: otherSale,
            message: 'Other sale entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete an other sale entry
 * DELETE /api/mills/:millId/other-sales/:id
 */
export const deleteOtherSaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteOtherSaleEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Other sale entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete other sale entries
 * DELETE /api/mills/:millId/other-sales/bulk
 */
export const bulkDeleteOtherSaleHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteOtherSaleEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} other sale entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
