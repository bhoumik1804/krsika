import {
    createDailyReceiptEntry,
    getDailyReceiptById,
    getDailyReceiptList,
    getDailyReceiptSummary,
    updateDailyReceiptEntry,
    deleteDailyReceiptEntry,
    bulkDeleteDailyReceiptEntries,
} from '../services/daily-receipt.service.js'

/**
 * Daily Receipt Controller
 * HTTP request handlers for daily receipt endpoints
 */

/**
 * Create a new daily receipt entry
 * POST /api/mills/:millId/daily-receipts
 */
export const createDailyReceipt = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyReceipt = await createDailyReceiptEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyReceipt,
            message: 'Daily receipt entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily receipt entry by ID
 * GET /api/mills/:millId/daily-receipts/:id
 */
export const getDailyReceiptByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyReceipt = await getDailyReceiptById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyReceipt,
            message: 'Daily receipt entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily receipt list with pagination
 * GET /api/mills/:millId/daily-receipts
 */
export const getDailyReceiptListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            status,
            paymentMode,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getDailyReceiptList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            paymentMode,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Daily receipt list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily receipt summary statistics
 * GET /api/mills/:millId/daily-receipts/summary
 */
export const getDailyReceiptSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyReceiptSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily receipt summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily receipt entry
 * PUT /api/mills/:millId/daily-receipts/:id
 */
export const updateDailyReceiptHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyReceipt = await updateDailyReceiptEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyReceipt,
            message: 'Daily receipt entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily receipt entry
 * DELETE /api/mills/:millId/daily-receipts/:id
 */
export const deleteDailyReceiptHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyReceiptEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily receipt entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily receipt entries
 * DELETE /api/mills/:millId/daily-receipts/bulk
 */
export const bulkDeleteDailyReceiptHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDailyReceiptEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} daily receipt entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
