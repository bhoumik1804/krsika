import express from 'express'
import {
    createDailyInward,
    getDailyInwardByIdHandler,
    getDailyInwardListHandler,
    getDailyInwardSummaryHandler,
    updateDailyInwardHandler,
    deleteDailyInwardHandler,
    bulkDeleteDailyInwardHandler,
} from '../controllers/daily-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDailyInwardSchema,
    updateDailyInwardSchema,
    getDailyInwardByIdSchema,
    deleteDailyInwardSchema,
    bulkDeleteDailyInwardSchema,
    listDailyInwardSchema,
    summaryDailyInwardSchema,
} from '../validators/daily-inward.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Daily Inward Routes
 * Base path: /api/mills/:millId/daily-inwards
 */

// GET /api/mills/:millId/daily-inwards/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryDailyInwardSchema),
    getDailyInwardSummaryHandler
)

// GET /api/mills/:millId/daily-inwards - Get list with pagination
router.get('/', validate(listDailyInwardSchema), getDailyInwardListHandler)

// GET /api/mills/:millId/daily-inwards/:id - Get by ID
router.get(
    '/:id',
    validate(getDailyInwardByIdSchema),
    getDailyInwardByIdHandler
)

// POST /api/mills/:millId/daily-inwards - Create new entry
router.post('/', validate(createDailyInwardSchema), createDailyInward)

// PUT /api/mills/:millId/daily-inwards/:id - Update entry
router.put('/:id', validate(updateDailyInwardSchema), updateDailyInwardHandler)

// DELETE /api/mills/:millId/daily-inwards/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteDailyInwardSchema),
    bulkDeleteDailyInwardHandler
)

// DELETE /api/mills/:millId/daily-inwards/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteDailyInwardSchema),
    deleteDailyInwardHandler
)

export default router
