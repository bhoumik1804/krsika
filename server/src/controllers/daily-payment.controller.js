import {
    createDailyPaymentEntry,
    getDailyPaymentById,
    getDailyPaymentList,
    getDailyPaymentSummary,
    updateDailyPaymentEntry,
    deleteDailyPaymentEntry,
    bulkDeleteDailyPaymentEntries,
} from '../services/daily-payment.service.js'

/**
 * Daily Payment Controller
 * HTTP request handlers for daily payment endpoints
 */

/**
 * Create a new daily payment entry
 * POST /api/mills/:millId/daily-payments
 */
export const createDailyPayment = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const dailyPayment = await createDailyPaymentEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: dailyPayment,
            message: 'Daily payment entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily payment entry by ID
 * GET /api/mills/:millId/daily-payments/:id
 */
export const getDailyPaymentByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const dailyPayment = await getDailyPaymentById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyPayment,
            message: 'Daily payment entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily payment list with pagination
 * GET /api/mills/:millId/daily-payments
 */
export const getDailyPaymentListHandler = async (req, res, next) => {
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

        const result = await getDailyPaymentList(millId, {
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
            message: 'Daily payment list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get daily payment summary statistics
 * GET /api/mills/:millId/daily-payments/summary
 */
export const getDailyPaymentSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getDailyPaymentSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Daily payment summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a daily payment entry
 * PUT /api/mills/:millId/daily-payments/:id
 */
export const updateDailyPaymentHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const dailyPayment = await updateDailyPaymentEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: dailyPayment,
            message: 'Daily payment entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a daily payment entry
 * DELETE /api/mills/:millId/daily-payments/:id
 */
export const deleteDailyPaymentHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDailyPaymentEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Daily payment entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete daily payment entries
 * DELETE /api/mills/:millId/daily-payments/bulk
 */
export const bulkDeleteDailyPaymentHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDailyPaymentEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} daily payment entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
