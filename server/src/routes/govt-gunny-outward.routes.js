import { Router } from 'express'
import {
    createGovtGunnyOutward,
    getGovtGunnyOutwardByIdHandler,
    getGovtGunnyOutwardListHandler,
    getGovtGunnyOutwardSummaryHandler,
    updateGovtGunnyOutwardHandler,
    deleteGovtGunnyOutwardHandler,
    bulkDeleteGovtGunnyOutwardHandler,
} from '../controllers/govt-gunny-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createGovtGunnyOutwardSchema,
    updateGovtGunnyOutwardSchema,
    getGovtGunnyOutwardByIdSchema,
    deleteGovtGunnyOutwardSchema,
    bulkDeleteGovtGunnyOutwardSchema,
    listGovtGunnyOutwardSchema,
    summaryGovtGunnyOutwardSchema,
} from '../validators/govt-gunny-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Govt Gunny Outward Routes
 * Base path: /api/mills/:millId/govt-gunny-outward
 */

// Get govt gunny outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(summaryGovtGunnyOutwardSchema),
    getGovtGunnyOutwardSummaryHandler
)

// Bulk delete govt gunny outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteGovtGunnyOutwardSchema),
    bulkDeleteGovtGunnyOutwardHandler
)

// Get govt gunny outward list with pagination
router.get(
    '/',
    authenticate,
    validate(listGovtGunnyOutwardSchema),
    getGovtGunnyOutwardListHandler
)

// Create a new govt gunny outward entry
router.post(
    '/',
    authenticate,
    validate(createGovtGunnyOutwardSchema),
    createGovtGunnyOutward
)

// Get govt gunny outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getGovtGunnyOutwardByIdSchema),
    getGovtGunnyOutwardByIdHandler
)

// Update a govt gunny outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateGovtGunnyOutwardSchema),
    updateGovtGunnyOutwardHandler
)

// Delete a govt gunny outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteGovtGunnyOutwardSchema),
    deleteGovtGunnyOutwardHandler
)

export default router
