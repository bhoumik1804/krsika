import { Router } from 'express'
import {
    createGunnySale,
    getGunnySaleByIdHandler,
    getGunnySaleListHandler,
    getGunnySaleSummaryHandler,
    updateGunnySaleHandler,
    deleteGunnySaleHandler,
    bulkDeleteGunnySaleHandler,
} from '../controllers/gunny-sale.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createGunnySaleSchema,
    updateGunnySaleSchema,
    getGunnySaleByIdSchema,
    deleteGunnySaleSchema,
    bulkDeleteGunnySaleSchema,
    getGunnySaleListSchema,
    getGunnySaleSummarySchema,
} from '../validators/gunny-sale.validator.js'

const router = Router({ mergeParams: true })

/**
 * Gunny Sale Routes
 * Base path: /api/mills/:millId/gunny-sales
 */

// Get gunny sale list with pagination
router.get(
    '/',
    authenticate,
    validate(getGunnySaleListSchema),
    getGunnySaleListHandler
)

// Get gunny sale summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getGunnySaleSummarySchema),
    getGunnySaleSummaryHandler
)

// Get gunny sale entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getGunnySaleByIdSchema),
    getGunnySaleByIdHandler
)

// Create a new gunny sale entry
router.post('/', authenticate, validate(createGunnySaleSchema), createGunnySale)

// Update a gunny sale entry
router.put(
    '/:id',
    authenticate,
    validate(updateGunnySaleSchema),
    updateGunnySaleHandler
)

// Bulk delete gunny sale entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteGunnySaleSchema),
    bulkDeleteGunnySaleHandler
)

// Delete a gunny sale entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteGunnySaleSchema),
    deleteGunnySaleHandler
)

export default router
