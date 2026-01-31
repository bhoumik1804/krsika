import express from 'express'
import {
    createDailyMilling,
    getDailyMillingByIdHandler,
    getDailyMillingListHandler,
    getDailyMillingSummaryHandler,
    updateDailyMillingHandler,
    deleteDailyMillingHandler,
    bulkDeleteDailyMillingHandler,
} from '../controllers/daily-milling.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyMillingSchema,
    updateDailyMillingSchema,
    getDailyMillingByIdSchema,
    deleteDailyMillingSchema,
    bulkDeleteDailyMillingSchema,
    listDailyMillingSchema,
    summaryDailyMillingSchema,
} from '../validators/daily-milling.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Milling Routes
 * Base path: /api/mills/:millId/daily-milling
 */

// GET /api/mills/:millId/daily-milling/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyMillingSchema),
    getDailyMillingSummaryHandler
)

// GET /api/mills/:millId/daily-milling - Get list with pagination
router.get('/', validate(listDailyMillingSchema), getDailyMillingListHandler)

// GET /api/mills/:millId/daily-milling/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyMillingByIdSchema),
    getDailyMillingByIdHandler
)

// POST /api/mills/:millId/daily-milling - Create new entry
router.post('/', validate(createDailyMillingSchema), createDailyMilling)

// PUT /api/mills/:millId/daily-milling/:id - Update entry
router.put(
    '/:id',
    validate(updateDailyMillingSchema),
    updateDailyMillingHandler
)

// DELETE /api/mills/:millId/daily-milling/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyMillingSchema),
    bulkDeleteDailyMillingHandler
)

// DELETE /api/mills/:millId/daily-milling/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyMillingSchema),
    deleteDailyMillingHandler
)

export default router
