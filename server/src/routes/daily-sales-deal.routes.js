import express from 'express'
import {
    createDailySalesDeal,
    getDailySalesDealByIdHandler,
    getDailySalesDealListHandler,
    getDailySalesDealSummaryHandler,
    updateDailySalesDealHandler,
    deleteDailySalesDealHandler,
    bulkDeleteDailySalesDealHandler,
} from '../controllers/daily-sales-deal.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailySalesDealSchema,
    updateDailySalesDealSchema,
    getDailySalesDealByIdSchema,
    deleteDailySalesDealSchema,
    bulkDeleteDailySalesDealSchema,
    listDailySalesDealSchema,
    summaryDailySalesDealSchema,
} from '../validators/daily-sales-deal.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Sales Deal Routes
 * Base path: /api/mills/:millId/daily-sales-deals
 */

// GET /api/mills/:millId/daily-sales-deals/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailySalesDealSchema),
    getDailySalesDealSummaryHandler
)

// GET /api/mills/:millId/daily-sales-deals - Get list with pagination
router.get(
    '/',
    validate(listDailySalesDealSchema),
    getDailySalesDealListHandler
)

// GET /api/mills/:millId/daily-sales-deals/:id - Get by ID
router.get(
    '/:id',
    validate(getDailySalesDealByIdSchema),
    getDailySalesDealByIdHandler
)

// POST /api/mills/:millId/daily-sales-deals - Create new entry
router.post('/', validate(createDailySalesDealSchema), createDailySalesDeal)

// PUT /api/mills/:millId/daily-sales-deals/:id - Update entry
router.put(
    '/:id',
    validate(updateDailySalesDealSchema),
    updateDailySalesDealHandler
)

// DELETE /api/mills/:millId/daily-sales-deals/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailySalesDealSchema),
    bulkDeleteDailySalesDealHandler
)

// DELETE /api/mills/:millId/daily-sales-deals/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailySalesDealSchema),
    deleteDailySalesDealHandler
)

export default router
