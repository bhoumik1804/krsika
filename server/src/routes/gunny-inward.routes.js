import { Router } from 'express'
import {
    createGunnyInward,
    getGunnyInwardByIdHandler,
    getGunnyInwardListHandler,
    getGunnyInwardSummaryHandler,
    updateGunnyInwardHandler,
    deleteGunnyInwardHandler,
    bulkDeleteGunnyInwardHandler,
} from '../controllers/gunny-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createGunnyInwardSchema,
    updateGunnyInwardSchema,
    getGunnyInwardByIdSchema,
    deleteGunnyInwardSchema,
    bulkDeleteGunnyInwardSchema,
    getGunnyInwardListSchema,
    getGunnyInwardSummarySchema,
} from '../validators/gunny-inward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Gunny Inward Routes
 * Base path: /api/mills/:millId/gunny-inward
 */

// Get gunny inward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getGunnyInwardSummarySchema),
    getGunnyInwardSummaryHandler
)

// Bulk delete gunny inward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteGunnyInwardSchema),
    bulkDeleteGunnyInwardHandler
)

// Get gunny inward list with pagination
router.get(
    '/',
    authenticate,
    validate(getGunnyInwardListSchema),
    getGunnyInwardListHandler
)

// Create a new gunny inward entry
router.post(
    '/',
    authenticate,
    validate(createGunnyInwardSchema),
    createGunnyInward
)

// Get gunny inward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getGunnyInwardByIdSchema),
    getGunnyInwardByIdHandler
)

// Update a gunny inward entry
router.put(
    '/:id',
    authenticate,
    validate(updateGunnyInwardSchema),
    updateGunnyInwardHandler
)

// Delete a gunny inward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteGunnyInwardSchema),
    deleteGunnyInwardHandler
)

export default router
