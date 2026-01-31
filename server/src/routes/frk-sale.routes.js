import { Router } from 'express'
import {
    createFrkSale,
    getFrkSaleByIdHandler,
    getFrkSaleListHandler,
    getFrkSaleSummaryHandler,
    updateFrkSaleHandler,
    deleteFrkSaleHandler,
    bulkDeleteFrkSaleHandler,
} from '../controllers/frk-sale.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createFrkSaleSchema,
    updateFrkSaleSchema,
    getFrkSaleByIdSchema,
    deleteFrkSaleSchema,
    bulkDeleteFrkSaleSchema,
    getFrkSaleListSchema,
    getFrkSaleSummarySchema,
} from '../validators/frk-sale.validator.js'

const router = Router({ mergeParams: true })

/**
 * FRK Sale Routes
 * Base path: /api/mills/:millId/frk-sales
 */

// Get FRK sale list with pagination
router.get(
    '/',
    authenticate,
    validate(getFrkSaleListSchema),
    getFrkSaleListHandler
)

// Get FRK sale summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getFrkSaleSummarySchema),
    getFrkSaleSummaryHandler
)

// Get FRK sale entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getFrkSaleByIdSchema),
    getFrkSaleByIdHandler
)

// Create a new FRK sale entry
router.post('/', authenticate, validate(createFrkSaleSchema), createFrkSale)

// Update a FRK sale entry
router.put(
    '/:id',
    authenticate,
    validate(updateFrkSaleSchema),
    updateFrkSaleHandler
)

// Bulk delete FRK sale entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteFrkSaleSchema),
    bulkDeleteFrkSaleHandler
)

// Delete a FRK sale entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteFrkSaleSchema),
    deleteFrkSaleHandler
)

export default router
