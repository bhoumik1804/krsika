import express from 'express'
import {
    createDailyReceipt,
    getDailyReceiptByIdHandler,
    getDailyReceiptListHandler,
    getDailyReceiptSummaryHandler,
    updateDailyReceiptHandler,
    deleteDailyReceiptHandler,
    bulkDeleteDailyReceiptHandler,
} from '../controllers/daily-receipt.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyReceiptSchema,
    updateDailyReceiptSchema,
    getDailyReceiptByIdSchema,
    deleteDailyReceiptSchema,
    bulkDeleteDailyReceiptSchema,
    listDailyReceiptSchema,
    summaryDailyReceiptSchema,
} from '../validators/daily-receipt.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Receipt Routes
 * Base path: /api/mills/:millId/daily-receipts
 */

// GET /api/mills/:millId/daily-receipts/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyReceiptSchema),
    getDailyReceiptSummaryHandler
)

// GET /api/mills/:millId/daily-receipts - Get list with pagination
router.get('/', validate(listDailyReceiptSchema), getDailyReceiptListHandler)

// GET /api/mills/:millId/daily-receipts/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyReceiptByIdSchema),
    getDailyReceiptByIdHandler
)

// POST /api/mills/:millId/daily-receipts - Create new entry
router.post('/', validate(createDailyReceiptSchema), createDailyReceipt)

// PUT /api/mills/:millId/daily-receipts/:id - Update entry
router.put(
    '/:id',
    validate(updateDailyReceiptSchema),
    updateDailyReceiptHandler
)

// DELETE /api/mills/:millId/daily-receipts/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyReceiptSchema),
    bulkDeleteDailyReceiptHandler
)

// DELETE /api/mills/:millId/daily-receipts/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyReceiptSchema),
    deleteDailyReceiptHandler
)

export default router
