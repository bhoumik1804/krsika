import {
    createDailyPurchaseDealEntry,
    getDailyPurchaseDealById,
    getDailyPurchaseDealList,
    getDailyPurchaseDealSummary,
    updateDailyPurchaseDealEntry,
    deleteDailyPurchaseDealEntry,
    bulkDeleteDailyPurchaseDealEntries,
} from '../services/daily-purchase-deal.service.js'

/**
 * Daily Purchase Deal Controller
 * HTTP request handlers for daily purchase deal endpoints
 */

/**
 * Create a new daily purchase deal entry
 * POST /api/mills/:millId/daily-purchase-deals
 */
export const createDailyPurchaseDeal = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyPurchaseDeal = await createDailyPurchaseDealEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyPurchaseDeal,
            message: 'Daily purchase deal entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily purchase deal entry by ID
 * GET /api/mills/:millId/daily-purchase-deals/:id
 */
export const getDailyPurchaseDealByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyPurchaseDeal = await getDailyPurchaseDealById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyPurchaseDeal,
            message: 'Daily purchase deal entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily purchase deal list with pagination
 * GET /api/mills/:millId/daily-purchase-deals
 */
export const getDailyPurchaseDealListHandler = async (req, res, next) => {
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

        const result = await getDailyPurchaseDealList(millId, {
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
            message: 'Daily purchase deal list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily purchase deal summary statistics
 * GET /api/mills/:millId/daily-purchase-deals/summary
 */
export const getDailyPurchaseDealSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyPurchaseDealSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily purchase deal summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily purchase deal entry
 * PUT /api/mills/:millId/daily-purchase-deals/:id
 */
export const updateDailyPurchaseDealHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyPurchaseDeal = await updateDailyPurchaseDealEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyPurchaseDeal,
            message: 'Daily purchase deal entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily purchase deal entry
 * DELETE /api/mills/:millId/daily-purchase-deals/:id
 */
export const deleteDailyPurchaseDealHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyPurchaseDealEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily purchase deal entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily purchase deal entries
 * DELETE /api/mills/:millId/daily-purchase-deals/bulk
 */
export const bulkDeleteDailyPurchaseDealHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDailyPurchaseDealEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} daily purchase deal entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
