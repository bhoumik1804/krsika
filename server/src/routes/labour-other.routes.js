import { Router } from 'express'
import {
    createLabourOther,
    getLabourOtherByIdHandler,
    getLabourOtherListHandler,
    getLabourOtherSummaryHandler,
    updateLabourOtherHandler,
    deleteLabourOtherHandler,
    bulkDeleteLabourOtherHandler,
} from '../controllers/labour-other.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createLabourOtherSchema,
    updateLabourOtherSchema,
    getLabourOtherByIdSchema,
    deleteLabourOtherSchema,
    bulkDeleteLabourOtherSchema,
    getLabourOtherListSchema,
    getLabourOtherSummarySchema,
} from '../validators/labour-other.validator.js'

const router = Router({ mergeParams: true })

/**
 * Labour Other Routes
 * Base path: /api/mills/:millId/labour-other
 */

// Get labour other list with pagination
router.get(
    '/',
    authenticate,
    validate(getLabourOtherListSchema),
    getLabourOtherListHandler
)

// Get labour other summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getLabourOtherSummarySchema),
    getLabourOtherSummaryHandler
)

// Get labour other entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getLabourOtherByIdSchema),
    getLabourOtherByIdHandler
)

// Create a new labour other entry
router.post(
    '/',
    authenticate,
    validate(createLabourOtherSchema),
    createLabourOther
)

// Update a labour other entry
router.put(
    '/:id',
    authenticate,
    validate(updateLabourOtherSchema),
    updateLabourOtherHandler
)

// Bulk delete labour other entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteLabourOtherSchema),
    bulkDeleteLabourOtherHandler
)

// Delete a labour other entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteLabourOtherSchema),
    deleteLabourOtherHandler
)

export default router
