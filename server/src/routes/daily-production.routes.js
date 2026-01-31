import express from 'express'
import {
    createDailyProduction,
    getDailyProductionByIdHandler,
    getDailyProductionListHandler,
    getDailyProductionSummaryHandler,
    updateDailyProductionHandler,
    deleteDailyProductionHandler,
    bulkDeleteDailyProductionHandler,
} from '../controllers/daily-production.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyProductionSchema,
    updateDailyProductionSchema,
    getDailyProductionByIdSchema,
    deleteDailyProductionSchema,
    bulkDeleteDailyProductionSchema,
    listDailyProductionSchema,
    summaryDailyProductionSchema,
} from '../validators/daily-production.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Production Routes
 * Base path: /api/mills/:millId/daily-production
 */

// GET /api/mills/:millId/daily-production/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyProductionSchema),
    getDailyProductionSummaryHandler
)

// GET /api/mills/:millId/daily-production - Get list with pagination
router.get(
    '/',
    validate(listDailyProductionSchema),
    getDailyProductionListHandler
)

// GET /api/mills/:millId/daily-production/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyProductionByIdSchema),
    getDailyProductionByIdHandler
)

// POST /api/mills/:millId/daily-production - Create new entry
router.post('/', validate(createDailyProductionSchema), createDailyProduction)

// PUT /api/mills/:millId/daily-production/:id - Update entry
router.put(
    '/:id',
    validate(updateDailyProductionSchema),
    updateDailyProductionHandler
)

// DELETE /api/mills/:millId/daily-production/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyProductionSchema),
    bulkDeleteDailyProductionHandler
)

// DELETE /api/mills/:millId/daily-production/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyProductionSchema),
    deleteDailyProductionHandler
)

export default router
