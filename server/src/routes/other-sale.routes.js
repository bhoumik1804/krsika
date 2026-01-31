import { Router } from 'express'
import {
    createOtherSale,
    getOtherSaleByIdHandler,
    getOtherSaleListHandler,
    getOtherSaleSummaryHandler,
    updateOtherSaleHandler,
    deleteOtherSaleHandler,
    bulkDeleteOtherSaleHandler,
} from '../controllers/other-sale.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createOtherSaleSchema,
    updateOtherSaleSchema,
    getOtherSaleByIdSchema,
    deleteOtherSaleSchema,
    bulkDeleteOtherSaleSchema,
    getOtherSaleListSchema,
    getOtherSaleSummarySchema,
} from '../validators/other-sale.validator.js'

const router = Router({ mergeParams: true })

/**
 * Other Sale Routes
 * Base path: /api/mills/:millId/other-sales
 */

// Get other sale list with pagination
router.get(
    '/',
    authenticate,
    validate(getOtherSaleListSchema),
    getOtherSaleListHandler
)

// Get other sale summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getOtherSaleSummarySchema),
    getOtherSaleSummaryHandler
)

// Get other sale entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getOtherSaleByIdSchema),
    getOtherSaleByIdHandler
)

// Create a new other sale entry
router.post('/', authenticate, validate(createOtherSaleSchema), createOtherSale)

// Update an other sale entry
router.put(
    '/:id',
    authenticate,
    validate(updateOtherSaleSchema),
    updateOtherSaleHandler
)

// Bulk delete other sale entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteOtherSaleSchema),
    bulkDeleteOtherSaleHandler
)

// Delete an other sale entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteOtherSaleSchema),
    deleteOtherSaleHandler
)

export default router
