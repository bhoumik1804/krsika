import { Router } from 'express'
import {
    createLabourInward,
    getLabourInwardByIdHandler,
    getLabourInwardListHandler,
    getLabourInwardSummaryHandler,
    updateLabourInwardHandler,
    deleteLabourInwardHandler,
    bulkDeleteLabourInwardHandler,
} from '../controllers/labour-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createLabourInwardSchema,
    updateLabourInwardSchema,
    getLabourInwardByIdSchema,
    deleteLabourInwardSchema,
    bulkDeleteLabourInwardSchema,
    getLabourInwardListSchema,
    getLabourInwardSummarySchema,
} from '../validators/labour-inward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Labour Inward Routes
 * Base path: /api/mills/:millId/labour-inward
 */

// Get labour inward list with pagination
router.get(
    '/',
    authenticate,
    validate(getLabourInwardListSchema),
    getLabourInwardListHandler
)

// Get labour inward summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getLabourInwardSummarySchema),
    getLabourInwardSummaryHandler
)

// Get labour inward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getLabourInwardByIdSchema),
    getLabourInwardByIdHandler
)

// Create a new labour inward entry
router.post(
    '/',
    authenticate,
    validate(createLabourInwardSchema),
    createLabourInward
)

// Update a labour inward entry
router.put(
    '/:id',
    authenticate,
    validate(updateLabourInwardSchema),
    updateLabourInwardHandler
)

// Bulk delete labour inward entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteLabourInwardSchema),
    bulkDeleteLabourInwardHandler
)

// Delete a labour inward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteLabourInwardSchema),
    deleteLabourInwardHandler
)

export default router
