import express from 'express'
import {
    createFinancialReceipt,
    getFinancialReceiptByIdHandler,
    getFinancialReceiptListHandler,
    getFinancialReceiptSummaryHandler,
    updateFinancialReceiptHandler,
    deleteFinancialReceiptHandler,
    bulkDeleteFinancialReceiptHandler,
} from '../controllers/financial-receipt.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createFinancialReceiptSchema,
    updateFinancialReceiptSchema,
    getFinancialReceiptByIdSchema,
    deleteFinancialReceiptSchema,
    bulkDeleteFinancialReceiptSchema,
    listFinancialReceiptSchema,
    summaryFinancialReceiptSchema,
} from '../validators/financial-receipt.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Financial Receipt Routes
 * Base path: /api/mills/:millId/financial-receipts
 */

// GET /api/mills/:millId/financial-receipts/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryFinancialReceiptSchema),
    getFinancialReceiptSummaryHandler
)

// GET /api/mills/:millId/financial-receipts - Get list with pagination
router.get(
    '/',
    validate(listFinancialReceiptSchema),
    getFinancialReceiptListHandler
)

// GET /api/mills/:millId/financial-receipts/:id - Get by ID
router.get(
    '/:id',
    validate(getFinancialReceiptByIdSchema),
    getFinancialReceiptByIdHandler
)

// POST /api/mills/:millId/financial-receipts - Create new entry
router.post('/', validate(createFinancialReceiptSchema), createFinancialReceipt)

// PUT /api/mills/:millId/financial-receipts/:id - Update entry
router.put(
    '/:id',
    validate(updateFinancialReceiptSchema),
    updateFinancialReceiptHandler
)

// DELETE /api/mills/:millId/financial-receipts/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteFinancialReceiptSchema),
    bulkDeleteFinancialReceiptHandler
)

// DELETE /api/mills/:millId/financial-receipts/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteFinancialReceiptSchema),
    deleteFinancialReceiptHandler
)

export default router
