import express from 'express'
import {
    createFinancialPayment,
    getFinancialPaymentByIdHandler,
    getFinancialPaymentListHandler,
    getFinancialPaymentSummaryHandler,
    updateFinancialPaymentHandler,
    deleteFinancialPaymentHandler,
    bulkDeleteFinancialPaymentHandler,
} from '../controllers/financial-payment.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createFinancialPaymentSchema,
    updateFinancialPaymentSchema,
    getFinancialPaymentByIdSchema,
    deleteFinancialPaymentSchema,
    bulkDeleteFinancialPaymentSchema,
    listFinancialPaymentSchema,
    summaryFinancialPaymentSchema,
} from '../validators/financial-payment.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Financial Payment Routes
 * Base path: /api/mills/:millId/financial-payments
 */

// GET /api/mills/:millId/financial-payments/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryFinancialPaymentSchema),
    getFinancialPaymentSummaryHandler
)

// GET /api/mills/:millId/financial-payments - Get list with pagination
router.get(
    '/',
    validate(listFinancialPaymentSchema),
    getFinancialPaymentListHandler
)

// GET /api/mills/:millId/financial-payments/:id - Get by ID
router.get(
    '/:id',
    validate(getFinancialPaymentByIdSchema),
    getFinancialPaymentByIdHandler
)

// POST /api/mills/:millId/financial-payments - Create new entry
router.post('/', validate(createFinancialPaymentSchema), createFinancialPayment)

// PUT /api/mills/:millId/financial-payments/:id - Update entry
router.put(
    '/:id',
    validate(updateFinancialPaymentSchema),
    updateFinancialPaymentHandler
)

// DELETE /api/mills/:millId/financial-payments/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteFinancialPaymentSchema),
    bulkDeleteFinancialPaymentHandler
)

// DELETE /api/mills/:millId/financial-payments/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteFinancialPaymentSchema),
    deleteFinancialPaymentHandler
)

export default router
