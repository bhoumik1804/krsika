import {
    createFinancialPaymentEntry,
    getFinancialPaymentById,
    getFinancialPaymentList,
    getFinancialPaymentSummary,
    updateFinancialPaymentEntry,
    deleteFinancialPaymentEntry,
    bulkDeleteFinancialPaymentEntries,
} from '../services/financial-payment.service.js'

/**
 * Financial Payment Controller
 * HTTP request handlers for financial payment endpoints
 */

/**
 * Create a new financial payment entry
 * POST /api/mills/:millId/financial-payments
 */
export const createFinancialPayment = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const financialPayment = await createFinancialPaymentEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: financialPayment,
            message: 'Financial payment entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get financial payment entry by ID
 * GET /api/mills/:millId/financial-payments/:id
 */
export const getFinancialPaymentByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const financialPayment = await getFinancialPaymentById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: financialPayment,
            message: 'Financial payment entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get financial payment list with pagination
 * GET /api/mills/:millId/financial-payments
 */
export const getFinancialPaymentListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            paymentMode,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getFinancialPaymentList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
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
            message: 'Financial payment list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get financial payment summary statistics
 * GET /api/mills/:millId/financial-payments/summary
 */
export const getFinancialPaymentSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getFinancialPaymentSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Financial payment summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a financial payment entry
 * PUT /api/mills/:millId/financial-payments/:id
 */
export const updateFinancialPaymentHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const financialPayment = await updateFinancialPaymentEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: financialPayment,
            message: 'Financial payment entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a financial payment entry
 * DELETE /api/mills/:millId/financial-payments/:id
 */
export const deleteFinancialPaymentHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteFinancialPaymentEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Financial payment entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete financial payment entries
 * DELETE /api/mills/:millId/financial-payments/bulk
 */
export const bulkDeleteFinancialPaymentHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteFinancialPaymentEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} financial payment entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
