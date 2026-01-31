import { Router } from 'express'
import {
    createOtherInward,
    getOtherInwardByIdHandler,
    getOtherInwardListHandler,
    getOtherInwardSummaryHandler,
    updateOtherInwardHandler,
    deleteOtherInwardHandler,
    bulkDeleteOtherInwardHandler,
} from '../controllers/other-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createOtherInwardSchema,
    updateOtherInwardSchema,
    getOtherInwardByIdSchema,
    deleteOtherInwardSchema,
    bulkDeleteOtherInwardSchema,
    getOtherInwardListSchema,
    getOtherInwardSummarySchema,
} from '../validators/other-inward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Other Inward Routes
 * Base path: /api/mills/:millId/other-inward
 */

// Get other inward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getOtherInwardSummarySchema),
    getOtherInwardSummaryHandler
)

// Bulk delete other inward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteOtherInwardSchema),
    bulkDeleteOtherInwardHandler
)

// Get other inward list with pagination
router.get(
    '/',
    authenticate,
    validate(getOtherInwardListSchema),
    getOtherInwardListHandler
)

// Create a new other inward entry
router.post(
    '/',
    authenticate,
    validate(createOtherInwardSchema),
    createOtherInward
)

// Get other inward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getOtherInwardByIdSchema),
    getOtherInwardByIdHandler
)

// Update an other inward entry
router.put(
    '/:id',
    authenticate,
    validate(updateOtherInwardSchema),
    updateOtherInwardHandler
)

// Delete an other inward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteOtherInwardSchema),
    deleteOtherInwardHandler
)

export default router
