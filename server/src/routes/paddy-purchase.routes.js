import express from 'express'
import {
    createPaddyPurchase,
    getPaddyPurchaseByIdHandler,
    getPaddyPurchaseListHandler,
    getPaddyPurchaseSummaryHandler,
    updatePaddyPurchaseHandler,
    deletePaddyPurchaseHandler,
    bulkDeletePaddyPurchaseHandler,
} from '../controllers/paddy-purchase.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPaddyPurchaseSchema,
    updatePaddyPurchaseSchema,
    getPaddyPurchaseByIdSchema,
    deletePaddyPurchaseSchema,
    bulkDeletePaddyPurchaseSchema,
    listPaddyPurchaseSchema,
    summaryPaddyPurchaseSchema,
} from '../validators/paddy-purchase.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Paddy Purchase Routes
 * Base path: /api/mills/:millId/paddy-purchase
 */

// GET /api/mills/:millId/paddy-purchase/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryPaddyPurchaseSchema),
    getPaddyPurchaseSummaryHandler
)

// GET /api/mills/:millId/paddy-purchase - Get list with pagination
router.get('/', validate(listPaddyPurchaseSchema), getPaddyPurchaseListHandler)

// GET /api/mills/:millId/paddy-purchase/:id - Get by ID
router.get(
    '/:id',
    validate(getPaddyPurchaseByIdSchema),
    getPaddyPurchaseByIdHandler
)

// POST /api/mills/:millId/paddy-purchase - Create new entry
router.post('/', validate(createPaddyPurchaseSchema), createPaddyPurchase)

// PUT /api/mills/:millId/paddy-purchase/:id - Update entry
router.put(
    '/:id',
    validate(updatePaddyPurchaseSchema),
    updatePaddyPurchaseHandler
)

// DELETE /api/mills/:millId/paddy-purchase/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeletePaddyPurchaseSchema),
    bulkDeletePaddyPurchaseHandler
)

// DELETE /api/mills/:millId/paddy-purchase/:id - Delete entry
router.delete(
    '/:id',
    validate(deletePaddyPurchaseSchema),
    deletePaddyPurchaseHandler
)

export default router
