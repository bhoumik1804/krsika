import { Router } from 'express'
import {
    createGunnyPurchase,
    getGunnyPurchaseByIdHandler,
    getGunnyPurchaseListHandler,
    getGunnyPurchaseSummaryHandler,
    updateGunnyPurchaseHandler,
    deleteGunnyPurchaseHandler,
    bulkDeleteGunnyPurchaseHandler,
} from '../controllers/gunny-purchase.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createGunnyPurchaseSchema,
    updateGunnyPurchaseSchema,
    getGunnyPurchaseByIdSchema,
    deleteGunnyPurchaseSchema,
    bulkDeleteGunnyPurchaseSchema,
    getGunnyPurchaseListSchema,
    getGunnyPurchaseSummarySchema,
} from '../validators/gunny-purchase.validator.js'

const router = Router({ mergeParams: true })

/**
 * Gunny Purchase Routes
 * Base path: /api/mills/:millId/gunny-purchase
 */

// Get gunny purchase list with pagination
router.get(
    '/',
    authenticate,
    validate(getGunnyPurchaseListSchema),
    getGunnyPurchaseListHandler
)

// Get gunny purchase summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getGunnyPurchaseSummarySchema),
    getGunnyPurchaseSummaryHandler
)

// Get gunny purchase entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getGunnyPurchaseByIdSchema),
    getGunnyPurchaseByIdHandler
)

// Create a new gunny purchase entry
router.post(
    '/',
    authenticate,
    validate(createGunnyPurchaseSchema),
    createGunnyPurchase
)

// Update a gunny purchase entry
router.put(
    '/:id',
    authenticate,
    validate(updateGunnyPurchaseSchema),
    updateGunnyPurchaseHandler
)

// Bulk delete gunny purchase entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteGunnyPurchaseSchema),
    bulkDeleteGunnyPurchaseHandler
)

// Delete a gunny purchase entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteGunnyPurchaseSchema),
    deleteGunnyPurchaseHandler
)

export default router
