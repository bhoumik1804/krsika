import { Router } from 'express'
import {
    createOtherPurchase,
    getOtherPurchaseByIdHandler,
    getOtherPurchaseListHandler,
    getOtherPurchaseSummaryHandler,
    updateOtherPurchaseHandler,
    deleteOtherPurchaseHandler,
    bulkDeleteOtherPurchaseHandler,
} from '../controllers/other-purchase.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createOtherPurchaseSchema,
    updateOtherPurchaseSchema,
    getOtherPurchaseByIdSchema,
    deleteOtherPurchaseSchema,
    bulkDeleteOtherPurchaseSchema,
    getOtherPurchaseListSchema,
    getOtherPurchaseSummarySchema,
} from '../validators/other-purchase.validator.js'

const router = Router({ mergeParams: true })

/**
 * Other Purchase Routes
 * Base path: /api/mills/:millId/other-purchase
 */

// Get other purchase list with pagination
router.get(
    '/',
    authenticate,
    validate(getOtherPurchaseListSchema),
    getOtherPurchaseListHandler
)

// Get other purchase summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getOtherPurchaseSummarySchema),
    getOtherPurchaseSummaryHandler
)

// Get other purchase entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getOtherPurchaseByIdSchema),
    getOtherPurchaseByIdHandler
)

// Create a new other purchase entry
router.post(
    '/',
    authenticate,
    validate(createOtherPurchaseSchema),
    createOtherPurchase
)

// Update a other purchase entry
router.put(
    '/:id',
    authenticate,
    validate(updateOtherPurchaseSchema),
    updateOtherPurchaseHandler
)

// Bulk delete other purchase entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteOtherPurchaseSchema),
    bulkDeleteOtherPurchaseHandler
)

// Delete a other purchase entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteOtherPurchaseSchema),
    deleteOtherPurchaseHandler
)

export default router
