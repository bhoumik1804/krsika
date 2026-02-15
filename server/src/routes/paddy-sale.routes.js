import { Router } from 'express'
import {
    createPaddySale,
    getPaddySaleByIdHandler,
    getPaddySaleListHandler,
    getPaddySaleSummaryHandler,
    updatePaddySaleHandler,
    deletePaddySaleHandler,
    bulkDeletePaddySaleHandler,
} from '../controllers/paddy-sale.controller.js'
import { validate } from '../middlewares/validate.js'
import {
    createPaddySaleSchema,
    updatePaddySaleSchema,
    getPaddySaleByIdSchema,
    deletePaddySaleSchema,
    bulkDeletePaddySaleSchema,
    getPaddySaleListSchema,
    getPaddySaleSummarySchema,
} from '../validators/paddy-sale.validator.js'

const router = Router({ mergeParams: true })

/**
 * Paddy Sale Routes
 * Base path: /api/mills/:millId/paddy-sales
 */

// GET /api/mills/:millId/paddy-sales/summary - Get summary statistics
router.get(
    '/summary',
    validate(getPaddySaleSummarySchema),
    getPaddySaleSummaryHandler
)

// GET /api/mills/:millId/paddy-sales - Get list with pagination
router.get('/', validate(getPaddySaleListSchema), getPaddySaleListHandler)

// GET /api/mills/:millId/paddy-sales/:id - Get by ID
router.get('/:id', validate(getPaddySaleByIdSchema), getPaddySaleByIdHandler)

// POST /api/mills/:millId/paddy-sales - Create new entry
router.post('/', validate(createPaddySaleSchema), createPaddySale)

// PUT /api/mills/:millId/paddy-sales/:id - Update entry
router.put('/:id', validate(updatePaddySaleSchema), updatePaddySaleHandler)

// DELETE /api/mills/:millId/paddy-sales/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeletePaddySaleSchema),
    bulkDeletePaddySaleHandler
)

// DELETE /api/mills/:millId/paddy-sales/:id - Delete entry
router.delete('/:id', validate(deletePaddySaleSchema), deletePaddySaleHandler)

export default router
