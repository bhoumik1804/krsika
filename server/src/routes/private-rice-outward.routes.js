import { Router } from 'express'
import {
    createPrivateRiceOutward,
    getPrivateRiceOutwardByIdHandler,
    getPrivateRiceOutwardListHandler,
    getPrivateRiceOutwardSummaryHandler,
    updatePrivateRiceOutwardHandler,
    deletePrivateRiceOutwardHandler,
    bulkDeletePrivateRiceOutwardHandler,
} from '../controllers/private-rice-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPrivateRiceOutwardSchema,
    updatePrivateRiceOutwardSchema,
    getPrivateRiceOutwardByIdSchema,
    deletePrivateRiceOutwardSchema,
    bulkDeletePrivateRiceOutwardSchema,
    getPrivateRiceOutwardListSchema,
    getPrivateRiceOutwardSummarySchema,
} from '../validators/private-rice-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Private Rice Outward Routes
 * Base path: /api/mills/:millId/private-rice-outward
 */

// Get private rice outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getPrivateRiceOutwardSummarySchema),
    getPrivateRiceOutwardSummaryHandler
)

// Bulk delete private rice outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeletePrivateRiceOutwardSchema),
    bulkDeletePrivateRiceOutwardHandler
)

// Get private rice outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getPrivateRiceOutwardListSchema),
    getPrivateRiceOutwardListHandler
)

// Create a new private rice outward entry
router.post(
    '/',
    authenticate,
    validate(createPrivateRiceOutwardSchema),
    createPrivateRiceOutward
)

// Get private rice outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getPrivateRiceOutwardByIdSchema),
    getPrivateRiceOutwardByIdHandler
)

// Update a private rice outward entry
router.put(
    '/:id',
    authenticate,
    validate(updatePrivateRiceOutwardSchema),
    updatePrivateRiceOutwardHandler
)

// Delete a private rice outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deletePrivateRiceOutwardSchema),
    deletePrivateRiceOutwardHandler
)

export default router
