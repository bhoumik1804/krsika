import {
    createDailyOutwardEntry,
    getDailyOutwardById,
    getDailyOutwardList,
    getDailyOutwardSummary,
    updateDailyOutwardEntry,
    deleteDailyOutwardEntry,
    bulkDeleteDailyOutwardEntries,
} from '../services/daily-outward.service.js'

/**
 * Daily Outward Controller
 * HTTP request handlers for daily outward endpoints
 */

/**
 * Create a new daily outward entry
 * POST /api/mills/:millId/daily-outwards
 */
export const createDailyOutward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyOutward = await createDailyOutwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyOutward,
            message: 'Daily outward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily outward entry by ID
 * GET /api/mills/:millId/daily-outwards/:id
 */
export const getDailyOutwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyOutward = await getDailyOutwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyOutward,
            message: 'Daily outward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily outward list with pagination
 * GET /api/mills/:millId/daily-outwards
 */
export const getDailyOutwardListHandler = async (req, res, next) => {
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

        const result = await getDailyOutwardList(millId, {
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
            message: 'Daily outward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily outward summary statistics
 * GET /api/mills/:millId/daily-outwards/summary
 */
export const getDailyOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyOutwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily outward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily outward entry
 * PUT /api/mills/:millId/daily-outwards/:id
 */
export const updateDailyOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyOutward = await updateDailyOutwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyOutward,
            message: 'Daily outward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily outward entry
 * DELETE /api/mills/:millId/daily-outwards/:id
 */
export const deleteDailyOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyOutwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily outward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily outward entries
 * DELETE /api/mills/:millId/daily-outwards/bulk
 */
export const bulkDeleteDailyOutwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDailyOutwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} daily outward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
