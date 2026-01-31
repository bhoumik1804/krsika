import express from 'express'
import {
    createDailyPayment,
    getDailyPaymentByIdHandler,
    getDailyPaymentListHandler,
    getDailyPaymentSummaryHandler,
    updateDailyPaymentHandler,
    deleteDailyPaymentHandler,
    bulkDeleteDailyPaymentHandler,
} from '../controllers/daily-payment.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyPaymentSchema,
    updateDailyPaymentSchema,
    getDailyPaymentByIdSchema,
    deleteDailyPaymentSchema,
    bulkDeleteDailyPaymentSchema,
    listDailyPaymentSchema,
    summaryDailyPaymentSchema,
} from '../validators/daily-payment.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Payment Routes
 * Base path: /api/mills/:millId/daily-payments
 */

// GET /api/mills/:millId/daily-payments/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyPaymentSchema),
    getDailyPaymentSummaryHandler
)

// GET /api/mills/:millId/daily-payments - Get list with pagination
router.get('/', validate(listDailyPaymentSchema), getDailyPaymentListHandler)

// GET /api/mills/:millId/daily-payments/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyPaymentByIdSchema),
    getDailyPaymentByIdHandler
)

// POST /api/mills/:millId/daily-payments - Create new entry
router.post('/', validate(createDailyPaymentSchema), createDailyPayment)

// PUT /api/mills/:millId/daily-payments/:id - Update entry
router.put(
    '/:id',
    validate(updateDailyPaymentSchema),
    updateDailyPaymentHandler
)

// DELETE /api/mills/:millId/daily-payments/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyPaymentSchema),
    bulkDeleteDailyPaymentHandler
)

// DELETE /api/mills/:millId/daily-payments/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyPaymentSchema),
    deleteDailyPaymentHandler
)

export default router
