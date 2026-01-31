import { Router } from 'express'
import {
    createRicePurchase,
    getRicePurchaseByIdHandler,
    getRicePurchaseListHandler,
    getRicePurchaseSummaryHandler,
    updateRicePurchaseHandler,
    deleteRicePurchaseHandler,
    bulkDeleteRicePurchaseHandler,
} from '../controllers/rice-purchase.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createRicePurchaseSchema,
    updateRicePurchaseSchema,
    getRicePurchaseByIdSchema,
    deleteRicePurchaseSchema,
    bulkDeleteRicePurchaseSchema,
    getRicePurchaseListSchema,
    getRicePurchaseSummarySchema,
} from '../validators/rice-purchase.validator.js'

const router = Router({ mergeParams: true })

/**
 * Rice Purchase Routes
 * Base path: /api/mills/:millId/rice-purchase
 */

// Get rice purchase list with pagination
router.get(
    '/',
    authenticate,
    validate(getRicePurchaseListSchema),
    getRicePurchaseListHandler
)

// Get rice purchase summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getRicePurchaseSummarySchema),
    getRicePurchaseSummaryHandler
)

// Get rice purchase entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getRicePurchaseByIdSchema),
    getRicePurchaseByIdHandler
)

// Create a new rice purchase entry
router.post(
    '/',
    authenticate,
    validate(createRicePurchaseSchema),
    createRicePurchase
)

// Update a rice purchase entry
router.put(
    '/:id',
    authenticate,
    validate(updateRicePurchaseSchema),
    updateRicePurchaseHandler
)

// Bulk delete rice purchase entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteRicePurchaseSchema),
    bulkDeleteRicePurchaseHandler
)

// Delete a rice purchase entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteRicePurchaseSchema),
    deleteRicePurchaseHandler
)

export default router
