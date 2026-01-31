import {
    createDailySalesDealEntry,
    getDailySalesDealById,
    getDailySalesDealList,
    getDailySalesDealSummary,
    updateDailySalesDealEntry,
    deleteDailySalesDealEntry,
    bulkDeleteDailySalesDealEntries,
} from '../services/daily-sales-deal.service.js'

/**
 * Daily Sales Deal Controller
 * HTTP request handlers for daily sales deal endpoints
 */

/**
 * Create a new daily sales deal entry
 * POST /api/mills/:millId/daily-sales-deals
 */
export const createDailySalesDeal = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailySalesDeal = await createDailySalesDealEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailySalesDeal,
            message: 'Daily sales deal entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily sales deal entry by ID
 * GET /api/mills/:millId/daily-sales-deals/:id
 */
export const getDailySalesDealByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailySalesDeal = await getDailySalesDealById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailySalesDeal,
            message: 'Daily sales deal entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily sales deal list with pagination
 * GET /api/mills/:millId/daily-sales-deals
 */
export const getDailySalesDealListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            paymentStatus,
            status,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getDailySalesDealList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            paymentStatus,
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
            message: 'Daily sales deal list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily sales deal summary statistics
 * GET /api/mills/:millId/daily-sales-deals/summary
 */
export const getDailySalesDealSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailySalesDealSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily sales deal summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily sales deal entry
 * PUT /api/mills/:millId/daily-sales-deals/:id
 */
export const updateDailySalesDealHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailySalesDeal = await updateDailySalesDealEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailySalesDeal,
            message: 'Daily sales deal entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily sales deal entry
 * DELETE /api/mills/:millId/daily-sales-deals/:id
 */
export const deleteDailySalesDealHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailySalesDealEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily sales deal entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily sales deal entries
 * DELETE /api/mills/:millId/daily-sales-deals/bulk
 */
export const bulkDeleteDailySalesDealHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDailySalesDealEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} daily sales deal entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
