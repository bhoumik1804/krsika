import {
    createStockOverviewEntry,
    getStockOverviewById,
    getStockOverviewList,
    getStockOverviewSummary,
    updateStockOverviewEntry,
    deleteStockOverviewEntry,
    bulkDeleteStockOverviewEntries,
} from '../services/stock-overview.service.js'

/**
 * Stock Overview Controller
 * HTTP request handlers for stock overview endpoints
 */

/**
 * Create a new stock overview entry
 * POST /api/mills/:millId/stock-overview
 */
export const createStockOverview = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const stockOverview = await createStockOverviewEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: stockOverview,
            message: 'Stock overview entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get stock overview entry by ID
 * GET /api/mills/:millId/stock-overview/:id
 */
export const getStockOverviewByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const stockOverview = await getStockOverviewById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: stockOverview,
            message: 'Stock overview entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get stock overview list with pagination
 * GET /api/mills/:millId/stock-overview
 */
export const getStockOverviewListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            status,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getStockOverviewList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Stock overview list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get stock overview summary statistics
 * GET /api/mills/:millId/stock-overview/summary
 */
export const getStockOverviewSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getStockOverviewSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Stock overview summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a stock overview entry
 * PUT /api/mills/:millId/stock-overview/:id
 */
export const updateStockOverviewHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const stockOverview = await updateStockOverviewEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: stockOverview,
            message: 'Stock overview entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a stock overview entry
 * DELETE /api/mills/:millId/stock-overview/:id
 */
export const deleteStockOverviewHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteStockOverviewEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Stock overview entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete stock overview entries
 * DELETE /api/mills/:millId/stock-overview/bulk
 */
export const bulkDeleteStockOverviewHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteStockOverviewEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} stock overview entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
