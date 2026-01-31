import express from 'express'
import {
    createRiceSale,
    getRiceSaleByIdHandler,
    getRiceSaleListHandler,
    getRiceSaleSummaryHandler,
    updateRiceSaleHandler,
    deleteRiceSaleHandler,
    bulkDeleteRiceSaleHandler,
} from '../controllers/rice-sale.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createRiceSaleSchema,
    updateRiceSaleSchema,
    getRiceSaleByIdSchema,
    deleteRiceSaleSchema,
    bulkDeleteRiceSaleSchema,
    listRiceSaleSchema,
    summaryRiceSaleSchema,
} from '../validators/rice-sale.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Rice Sale Routes
 * Base path: /api/mills/:millId/rice-sales
 */

// GET /api/mills/:millId/rice-sales/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryRiceSaleSchema),
    getRiceSaleSummaryHandler
)

// GET /api/mills/:millId/rice-sales - Get list with pagination
router.get('/', validate(listRiceSaleSchema), getRiceSaleListHandler)

// GET /api/mills/:millId/rice-sales/:id - Get by ID
router.get('/:id', validate(getRiceSaleByIdSchema), getRiceSaleByIdHandler)

// POST /api/mills/:millId/rice-sales - Create new entry
router.post('/', validate(createRiceSaleSchema), createRiceSale)

// PUT /api/mills/:millId/rice-sales/:id - Update entry
router.put('/:id', validate(updateRiceSaleSchema), updateRiceSaleHandler)

// DELETE /api/mills/:millId/rice-sales/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteRiceSaleSchema),
    bulkDeleteRiceSaleHandler
)

// DELETE /api/mills/:millId/rice-sales/:id - Delete entry
router.delete('/:id', validate(deleteRiceSaleSchema), deleteRiceSaleHandler)

export default router
