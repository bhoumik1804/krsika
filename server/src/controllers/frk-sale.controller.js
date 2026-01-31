import {
    createFrkSaleEntry,
    getFrkSaleById,
    getFrkSaleList,
    getFrkSaleSummary,
    updateFrkSaleEntry,
    deleteFrkSaleEntry,
    bulkDeleteFrkSaleEntries,
} from '../services/frk-sale.service.js'

/**
 * FRK Sale Controller
 * HTTP request handlers for FRK sale endpoints
 */

/**
 * Create a new FRK sale entry
 * POST /api/mills/:millId/frk-sales
 */
export const createFrkSale = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const frkSale = await createFrkSaleEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: frkSale,
            message: 'FRK sale entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK sale entry by ID
 * GET /api/mills/:millId/frk-sales/:id
 */
export const getFrkSaleByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const frkSale = await getFrkSaleById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: frkSale,
            message: 'FRK sale entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK sale list with pagination
 * GET /api/mills/:millId/frk-sales
 */
export const getFrkSaleListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getFrkSaleList(millId, {
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
            message: 'FRK sale list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK sale summary statistics
 * GET /api/mills/:millId/frk-sales/summary
 */
export const getFrkSaleSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getFrkSaleSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'FRK sale summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a FRK sale entry
 * PUT /api/mills/:millId/frk-sales/:id
 */
export const updateFrkSaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const frkSale = await updateFrkSaleEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: frkSale,
            message: 'FRK sale entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a FRK sale entry
 * DELETE /api/mills/:millId/frk-sales/:id
 */
export const deleteFrkSaleHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteFrkSaleEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'FRK sale entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete FRK sale entries
 * DELETE /api/mills/:millId/frk-sales/bulk
 */
export const bulkDeleteFrkSaleHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteFrkSaleEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} FRK sale entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
