import { Router } from 'express'
import {
    createPrivateGunnyOutward,
    getPrivateGunnyOutwardByIdHandler,
    getPrivateGunnyOutwardListHandler,
    getPrivateGunnyOutwardSummaryHandler,
    updatePrivateGunnyOutwardHandler,
    deletePrivateGunnyOutwardHandler,
    bulkDeletePrivateGunnyOutwardHandler,
} from '../controllers/private-gunny-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPrivateGunnyOutwardSchema,
    updatePrivateGunnyOutwardSchema,
    getPrivateGunnyOutwardByIdSchema,
    deletePrivateGunnyOutwardSchema,
    bulkDeletePrivateGunnyOutwardSchema,
    listPrivateGunnyOutwardSchema,
    summaryPrivateGunnyOutwardSchema,
} from '../validators/private-gunny-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Private Gunny Outward Routes
 * Base path: /api/mills/:millId/private-gunny-outward
 */

// Get private gunny outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(summaryPrivateGunnyOutwardSchema),
    getPrivateGunnyOutwardSummaryHandler
)

// Bulk delete private gunny outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeletePrivateGunnyOutwardSchema),
    bulkDeletePrivateGunnyOutwardHandler
)

// Get private gunny outward list with pagination
router.get(
    '/',
    authenticate,
    validate(listPrivateGunnyOutwardSchema),
    getPrivateGunnyOutwardListHandler
)

// Create a new private gunny outward entry
router.post(
    '/',
    authenticate,
    validate(createPrivateGunnyOutwardSchema),
    createPrivateGunnyOutward
)

// Get private gunny outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getPrivateGunnyOutwardByIdSchema),
    getPrivateGunnyOutwardByIdHandler
)

// Update a private gunny outward entry
router.put(
    '/:id',
    authenticate,
    validate(updatePrivateGunnyOutwardSchema),
    updatePrivateGunnyOutwardHandler
)

// Delete a private gunny outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deletePrivateGunnyOutwardSchema),
    deletePrivateGunnyOutwardHandler
)

export default router
