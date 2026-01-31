import { Router } from 'express'
import {
    createRiceInward,
    getRiceInwardByIdHandler,
    getRiceInwardListHandler,
    getRiceInwardSummaryHandler,
    updateRiceInwardHandler,
    deleteRiceInwardHandler,
    bulkDeleteRiceInwardHandler,
} from '../controllers/rice-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createRiceInwardSchema,
    updateRiceInwardSchema,
    getRiceInwardByIdSchema,
    deleteRiceInwardSchema,
    bulkDeleteRiceInwardSchema,
    getRiceInwardListSchema,
    getRiceInwardSummarySchema,
} from '../validators/rice-inward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Rice Inward Routes
 * Base path: /api/mills/:millId/rice-inward
 */

// Get rice inward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getRiceInwardSummarySchema),
    getRiceInwardSummaryHandler
)

// Bulk delete rice inward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteRiceInwardSchema),
    bulkDeleteRiceInwardHandler
)

// Get rice inward list with pagination
router.get(
    '/',
    authenticate,
    validate(getRiceInwardListSchema),
    getRiceInwardListHandler
)

// Create a new rice inward entry
router.post(
    '/',
    authenticate,
    validate(createRiceInwardSchema),
    createRiceInward
)

// Get rice inward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getRiceInwardByIdSchema),
    getRiceInwardByIdHandler
)

// Update a rice inward entry
router.put(
    '/:id',
    authenticate,
    validate(updateRiceInwardSchema),
    updateRiceInwardHandler
)

// Delete a rice inward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteRiceInwardSchema),
    deleteRiceInwardHandler
)

export default router
