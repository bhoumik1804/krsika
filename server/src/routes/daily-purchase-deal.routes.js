import express from 'express'
import {
    createDailyPurchaseDeal,
    getDailyPurchaseDealByIdHandler,
    getDailyPurchaseDealListHandler,
    getDailyPurchaseDealSummaryHandler,
    updateDailyPurchaseDealHandler,
    deleteDailyPurchaseDealHandler,
    bulkDeleteDailyPurchaseDealHandler,
} from '../controllers/daily-purchase-deal.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyPurchaseDealSchema,
    updateDailyPurchaseDealSchema,
    getDailyPurchaseDealByIdSchema,
    deleteDailyPurchaseDealSchema,
    bulkDeleteDailyPurchaseDealSchema,
    listDailyPurchaseDealSchema,
    summaryDailyPurchaseDealSchema,
} from '../validators/daily-purchase-deal.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Purchase Deal Routes
 * Base path: /api/mills/:millId/daily-purchase-deals
 */

// GET /api/mills/:millId/daily-purchase-deals/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyPurchaseDealSchema),
    getDailyPurchaseDealSummaryHandler
)

// GET /api/mills/:millId/daily-purchase-deals - Get list with pagination
router.get(
    '/',
    validate(listDailyPurchaseDealSchema),
    getDailyPurchaseDealListHandler
)

// GET /api/mills/:millId/daily-purchase-deals/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyPurchaseDealByIdSchema),
    getDailyPurchaseDealByIdHandler
)

// POST /api/mills/:millId/daily-purchase-deals - Create new entry
router.post(
    '/',
    validate(createDailyPurchaseDealSchema),
    createDailyPurchaseDeal
)

// PUT /api/mills/:millId/daily-purchase-deals/:id - Update entry
router.put(
    '/:id',
    validate(updateDailyPurchaseDealSchema),
    updateDailyPurchaseDealHandler
)

// DELETE /api/mills/:millId/daily-purchase-deals/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyPurchaseDealSchema),
    bulkDeleteDailyPurchaseDealHandler
)

// DELETE /api/mills/:millId/daily-purchase-deals/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyPurchaseDealSchema),
    deleteDailyPurchaseDealHandler
)

export default router
