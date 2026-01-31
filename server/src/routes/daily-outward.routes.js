import express from 'express'
import {
    createDailyOutward,
    getDailyOutwardByIdHandler,
    getDailyOutwardListHandler,
    getDailyOutwardSummaryHandler,
    updateDailyOutwardHandler,
    deleteDailyOutwardHandler,
    bulkDeleteDailyOutwardHandler,
} from '../controllers/daily-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyOutwardSchema,
    updateDailyOutwardSchema,
    getDailyOutwardByIdSchema,
    deleteDailyOutwardSchema,
    bulkDeleteDailyOutwardSchema,
    listDailyOutwardSchema,
    summaryDailyOutwardSchema,
} from '../validators/daily-outward.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Outward Routes
 * Base path: /api/mills/:millId/daily-outwards
 */

// GET /api/mills/:millId/daily-outwards/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyOutwardSchema),
    getDailyOutwardSummaryHandler
)

// GET /api/mills/:millId/daily-outwards - Get list with pagination
router.get('/', validate(listDailyOutwardSchema), getDailyOutwardListHandler)

// GET /api/mills/:millId/daily-outwards/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyOutwardByIdSchema),
    getDailyOutwardByIdHandler
)

// POST /api/mills/:millId/daily-outwards - Create new entry
router.post('/', validate(createDailyOutwardSchema), createDailyOutward)

// PUT /api/mills/:millId/daily-outwards/:id - Update entry
router.put(
    '/:id',
    validate(updateDailyOutwardSchema),
    updateDailyOutwardHandler
)

// DELETE /api/mills/:millId/daily-outwards/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyOutwardSchema),
    bulkDeleteDailyOutwardHandler
)

// DELETE /api/mills/:millId/daily-outwards/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyOutwardSchema),
    deleteDailyOutwardHandler
)

export default router
