import {
    createDailyProductionEntry,
    getDailyProductionById,
    getDailyProductionList,
    getDailyProductionSummary,
    updateDailyProductionEntry,
    deleteDailyProductionEntry,
    bulkDeleteDailyProductionEntries,
} from '../services/daily-production.service.js'

/**
 * Daily Production Controller
 * HTTP request handlers for daily production endpoints
 */

/**
 * Create a new daily production entry
 * POST /api/mills/:millId/daily-production
 */
export const createDailyProduction = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyProduction = await createDailyProductionEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyProduction,
            message: 'Daily production entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily production entry by ID
 * GET /api/mills/:millId/daily-production/:id
 */
export const getDailyProductionByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyProduction = await getDailyProductionById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyProduction,
            message: 'Daily production entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily production list with pagination
 * GET /api/mills/:millId/daily-production
 */
export const getDailyProductionListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            status,
            itemType,
            warehouse,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getDailyProductionList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            itemType,
            warehouse,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Daily production list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily production summary statistics
 * GET /api/mills/:millId/daily-production/summary
 */
export const getDailyProductionSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyProductionSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily production summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily production entry
 * PUT /api/mills/:millId/daily-production/:id
 */
export const updateDailyProductionHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyProduction = await updateDailyProductionEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyProduction,
            message: 'Daily production entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily production entry
 * DELETE /api/mills/:millId/daily-production/:id
 */
export const deleteDailyProductionHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyProductionEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily production entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily production entries
 * DELETE /api/mills/:millId/daily-production/bulk
 */
export const bulkDeleteDailyProductionHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const result = await bulkDeleteDailyProductionEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: `${result.deletedCount} entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
