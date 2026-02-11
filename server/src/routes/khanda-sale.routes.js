import express from 'express'
import {
    createKhandaSale,
    getKhandaSaleByIdHandler,
    getKhandaSaleListHandler,
    getKhandaSaleSummaryHandler,
    updateKhandaSaleHandler,
    deleteKhandaSaleHandler,
    bulkDeleteKhandaSaleHandler,
} from '../controllers/khanda-sale.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createKhandaSaleSchema,
    updateKhandaSaleSchema,
    getKhandaSaleByIdSchema,
    deleteKhandaSaleSchema,
    bulkDeleteKhandaSaleSchema,
    listKhandaSaleSchema,
    summaryKhandaSaleSchema,
} from '../validators/khanda-sale.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Khanda Sale Routes
 * Base path: /api/mills/:millId/khanda-sales
 */

// GET /api/mills/:millId/khanda-sales/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryKhandaSaleSchema),
    getKhandaSaleSummaryHandler
)

// GET /api/mills/:millId/khanda-sales - Get list with pagination
router.get('/', validate(listKhandaSaleSchema), getKhandaSaleListHandler)

// GET /api/mills/:millId/khanda-sales/:id - Get by ID
router.get('/:id', validate(getKhandaSaleByIdSchema), getKhandaSaleByIdHandler)

// POST /api/mills/:millId/khanda-sales - Create new entry
router.post('/', validate(createKhandaSaleSchema), createKhandaSale)

// PUT /api/mills/:millId/khanda-sales/:id - Update entry
router.put('/:id', validate(updateKhandaSaleSchema), updateKhandaSaleHandler)

// DELETE /api/mills/:millId/khanda-sales/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteKhandaSaleSchema),
    bulkDeleteKhandaSaleHandler
)

// DELETE /api/mills/:millId/khanda-sales/:id - Delete entry
router.delete('/:id', validate(deleteKhandaSaleSchema), deleteKhandaSaleHandler)

export default router
