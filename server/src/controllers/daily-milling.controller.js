import {
    createDailyMillingEntry,
    getDailyMillingById,
    getDailyMillingList,
    getDailyMillingSummary,
    updateDailyMillingEntry,
    deleteDailyMillingEntry,
    bulkDeleteDailyMillingEntries,
} from '../services/daily-milling.service.js'

/**
 * Daily Milling Controller
 * HTTP request handlers for daily milling endpoints
 */

/**
 * Create a new daily milling entry
 * POST /api/mills/:millId/daily-milling
 */
export const createDailyMilling = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyMilling = await createDailyMillingEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyMilling,
            message: 'Daily milling entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily milling entry by ID
 * GET /api/mills/:millId/daily-milling/:id
 */
export const getDailyMillingByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyMilling = await getDailyMillingById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyMilling,
            message: 'Daily milling entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily milling list with pagination
 * GET /api/mills/:millId/daily-milling
 */
export const getDailyMillingListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            status,
            shift,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getDailyMillingList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            shift,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Daily milling list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily milling summary statistics
 * GET /api/mills/:millId/daily-milling/summary
 */
export const getDailyMillingSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyMillingSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily milling summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily milling entry
 * PUT /api/mills/:millId/daily-milling/:id
 */
export const updateDailyMillingHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyMilling = await updateDailyMillingEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyMilling,
            message: 'Daily milling entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily milling entry
 * DELETE /api/mills/:millId/daily-milling/:id
 */
export const deleteDailyMillingHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyMillingEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily milling entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily milling entries
 * DELETE /api/mills/:millId/daily-milling/bulk
 */
export const bulkDeleteDailyMillingHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const result = await bulkDeleteDailyMillingEntries(millId, ids)

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
