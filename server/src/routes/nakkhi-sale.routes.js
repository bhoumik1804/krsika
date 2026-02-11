import express from 'express'
import {
    createNakkhiSale,
    getNakkhiSaleByIdHandler,
    getNakkhiSaleListHandler,
    getNakkhiSaleSummaryHandler,
    updateNakkhiSaleHandler,
    deleteNakkhiSaleHandler,
    bulkDeleteNakkhiSaleHandler,
} from '../controllers/nakkhi-sale.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createNakkhiSaleSchema,
    updateNakkhiSaleSchema,
    getNakkhiSaleByIdSchema,
    deleteNakkhiSaleSchema,
    bulkDeleteNakkhiSaleSchema,
    listNakkhiSaleSchema,
    summaryNakkhiSaleSchema,
} from '../validators/nakkhi-sale.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Nakkhi Sale Routes
 * Base path: /api/mills/:millId/nakkhi-sales
 */

// GET /api/mills/:millId/nakkhi-sales/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryNakkhiSaleSchema),
    getNakkhiSaleSummaryHandler
)

// GET /api/mills/:millId/nakkhi-sales - Get list with pagination
router.get('/', validate(listNakkhiSaleSchema), getNakkhiSaleListHandler)

// GET /api/mills/:millId/nakkhi-sales/:id - Get by ID
router.get('/:id', validate(getNakkhiSaleByIdSchema), getNakkhiSaleByIdHandler)

// POST /api/mills/:millId/nakkhi-sales - Create new entry
router.post('/', validate(createNakkhiSaleSchema), createNakkhiSale)

// PUT /api/mills/:millId/nakkhi-sales/:id - Update entry
router.put('/:id', validate(updateNakkhiSaleSchema), updateNakkhiSaleHandler)

// DELETE /api/mills/:millId/nakkhi-sales/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteNakkhiSaleSchema),
    bulkDeleteNakkhiSaleHandler
)

// DELETE /api/mills/:millId/nakkhi-sales/:id - Delete entry
router.delete('/:id', validate(deleteNakkhiSaleSchema), deleteNakkhiSaleHandler)

export default router
