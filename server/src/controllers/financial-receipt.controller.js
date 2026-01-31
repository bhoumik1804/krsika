import {
    createFinancialReceiptEntry,
    getFinancialReceiptById,
    getFinancialReceiptList,
    getFinancialReceiptSummary,
    updateFinancialReceiptEntry,
    deleteFinancialReceiptEntry,
    bulkDeleteFinancialReceiptEntries,
} from '../services/financial-receipt.service.js'

/**
 * Financial Receipt Controller
 * HTTP request handlers for financial receipt endpoints
 */

/**
 * Create a new financial receipt entry
 * POST /api/mills/:millId/financial-receipts
 */
export const createFinancialReceipt = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const financialReceipt = await createFinancialReceiptEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: financialReceipt,
            message: 'Financial receipt entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get financial receipt entry by ID
 * GET /api/mills/:millId/financial-receipts/:id
 */
export const getFinancialReceiptByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const financialReceipt = await getFinancialReceiptById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: financialReceipt,
            message: 'Financial receipt entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get financial receipt list with pagination
 * GET /api/mills/:millId/financial-receipts
 */
export const getFinancialReceiptListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            receiptMode,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getFinancialReceiptList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            receiptMode,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Financial receipt list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get financial receipt summary statistics
 * GET /api/mills/:millId/financial-receipts/summary
 */
export const getFinancialReceiptSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getFinancialReceiptSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Financial receipt summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a financial receipt entry
 * PUT /api/mills/:millId/financial-receipts/:id
 */
export const updateFinancialReceiptHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const financialReceipt = await updateFinancialReceiptEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: financialReceipt,
            message: 'Financial receipt entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a financial receipt entry
 * DELETE /api/mills/:millId/financial-receipts/:id
 */
export const deleteFinancialReceiptHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteFinancialReceiptEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Financial receipt entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete financial receipt entries
 * DELETE /api/mills/:millId/financial-receipts/bulk
 */
export const bulkDeleteFinancialReceiptHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteFinancialReceiptEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} financial receipt entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
