import { Router } from 'express'
import {
    createOtherOutward,
    getOtherOutwardByIdHandler,
    getOtherOutwardListHandler,
    getOtherOutwardSummaryHandler,
    updateOtherOutwardHandler,
    deleteOtherOutwardHandler,
    bulkDeleteOtherOutwardHandler,
} from '../controllers/other-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createOtherOutwardSchema,
    updateOtherOutwardSchema,
    getOtherOutwardByIdSchema,
    deleteOtherOutwardSchema,
    bulkDeleteOtherOutwardSchema,
    getOtherOutwardListSchema,
    getOtherOutwardSummarySchema,
} from '../validators/other-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Other Outward Routes
 * Base path: /api/mills/:millId/other-outward
 */

// Get other outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getOtherOutwardSummarySchema),
    getOtherOutwardSummaryHandler
)

// Bulk delete other outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteOtherOutwardSchema),
    bulkDeleteOtherOutwardHandler
)

// Get other outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getOtherOutwardListSchema),
    getOtherOutwardListHandler
)

// Create a new other outward entry
router.post(
    '/',
    authenticate,
    validate(createOtherOutwardSchema),
    createOtherOutward
)

// Get other outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getOtherOutwardByIdSchema),
    getOtherOutwardByIdHandler
)

// Update a other outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateOtherOutwardSchema),
    updateOtherOutwardHandler
)

// Delete a other outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteOtherOutwardSchema),
    deleteOtherOutwardHandler
)

export default router
