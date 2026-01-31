import {
    createDailyInwardEntry,
    getDailyInwardById,
    getDailyInwardList,
    getDailyInwardSummary,
    updateDailyInwardEntry,
    deleteDailyInwardEntry,
    bulkDeleteDailyInwardEntries,
} from '../services/daily-inward.service.js'

/**
 * Daily Inward Controller
 * HTTP request handlers for daily inward endpoints
 */

/**
 * Create a new daily inward entry
 * POST /api/mills/:millId/daily-inwards
 */
export const createDailyInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyInward = await createDailyInwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyInward,
            message: 'Daily inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily inward entry by ID
 * GET /api/mills/:millId/daily-inwards/:id
 */
export const getDailyInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyInward = await getDailyInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyInward,
            message: 'Daily inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily inward list with pagination
 * GET /api/mills/:millId/daily-inwards
 */
export const getDailyInwardListHandler = async (req, res, next) => {
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

        const result = await getDailyInwardList(millId, {
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
            message: 'Daily inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily inward summary statistics
 * GET /api/mills/:millId/daily-inwards/summary
 */
export const getDailyInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily inward entry
 * PUT /api/mills/:millId/daily-inwards/:id
 */
export const updateDailyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyInward = await updateDailyInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyInward,
            message: 'Daily inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily inward entry
 * DELETE /api/mills/:millId/daily-inwards/:id
 */
export const deleteDailyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily inward entries
 * DELETE /api/mills/:millId/daily-inwards/bulk
 */
export const bulkDeleteDailyInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDailyInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} daily inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
