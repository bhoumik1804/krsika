import express from 'express'
import {
    createMillingPaddy,
    getMillingPaddyByIdHandler,
    getMillingPaddyListHandler,
    getMillingPaddySummaryHandler,
    updateMillingPaddyHandler,
    deleteMillingPaddyHandler,
    bulkDeleteMillingPaddyHandler,
} from '../controllers/milling-paddy.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createMillingPaddySchema,
    updateMillingPaddySchema,
    getMillingPaddyByIdSchema,
    deleteMillingPaddySchema,
    bulkDeleteMillingPaddySchema,
    listMillingPaddySchema,
    summaryMillingPaddySchema,
} from '../validators/milling-paddy.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Milling Paddy Routes
 * Base path: /api/mills/:millId/milling-paddy
 */

// GET /api/mills/:millId/milling-paddy/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryMillingPaddySchema),
    getMillingPaddySummaryHandler
)

// GET /api/mills/:millId/milling-paddy - Get list with pagination
router.get('/', validate(listMillingPaddySchema), getMillingPaddyListHandler)

// GET /api/mills/:millId/milling-paddy/:id - Get by ID
router.get(
    '/:id',
    validate(getMillingPaddyByIdSchema),
    getMillingPaddyByIdHandler
)

// POST /api/mills/:millId/milling-paddy - Create new entry
router.post('/', validate(createMillingPaddySchema), createMillingPaddy)

// PUT /api/mills/:millId/milling-paddy/:id - Update entry
router.put(
    '/:id',
    validate(updateMillingPaddySchema),
    updateMillingPaddyHandler
)

// DELETE /api/mills/:millId/milling-paddy/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteMillingPaddySchema),
    bulkDeleteMillingPaddyHandler
)

// DELETE /api/mills/:millId/milling-paddy/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteMillingPaddySchema),
    deleteMillingPaddyHandler
)

export default router
