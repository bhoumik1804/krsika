import { Router } from 'express'
import {
    createFrkPurchase,
    getFrkPurchaseByIdHandler,
    getFrkPurchaseListHandler,
    getFrkPurchaseSummaryHandler,
    updateFrkPurchaseHandler,
    deleteFrkPurchaseHandler,
    bulkDeleteFrkPurchaseHandler,
} from '../controllers/frk-purchase.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createFrkPurchaseSchema,
    updateFrkPurchaseSchema,
    getFrkPurchaseByIdSchema,
    deleteFrkPurchaseSchema,
    bulkDeleteFrkPurchaseSchema,
    getFrkPurchaseListSchema,
    getFrkPurchaseSummarySchema,
} from '../validators/frk-purchase.validator.js'

const router = Router({ mergeParams: true })

/**
 * FRK Purchase Routes
 * Base path: /api/mills/:millId/frk-purchase
 */

// Get FRK purchase list with pagination
router.get(
    '/',
    authenticate,
    validate(getFrkPurchaseListSchema),
    getFrkPurchaseListHandler
)

// Get FRK purchase summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getFrkPurchaseSummarySchema),
    getFrkPurchaseSummaryHandler
)

// Get FRK purchase entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getFrkPurchaseByIdSchema),
    getFrkPurchaseByIdHandler
)

// Create a new FRK purchase entry
router.post(
    '/',
    authenticate,
    validate(createFrkPurchaseSchema),
    createFrkPurchase
)

// Update a FRK purchase entry
router.put(
    '/:id',
    authenticate,
    validate(updateFrkPurchaseSchema),
    updateFrkPurchaseHandler
)

// Bulk delete FRK purchase entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteFrkPurchaseSchema),
    bulkDeleteFrkPurchaseHandler
)

// Delete a FRK purchase entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteFrkPurchaseSchema),
    deleteFrkPurchaseHandler
)

export default router
