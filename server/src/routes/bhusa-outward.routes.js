import { Router } from 'express'
import {
    createBhusaOutward,
    getBhusaOutwardByIdHandler,
    getBhusaOutwardListHandler,
    getBhusaOutwardSummaryHandler,
    updateBhusaOutwardHandler,
    deleteBhusaOutwardHandler,
    bulkDeleteBhusaOutwardHandler,
} from '../controllers/bhusa-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createBhusaOutwardSchema,
    updateBhusaOutwardSchema,
    getBhusaOutwardByIdSchema,
    deleteBhusaOutwardSchema,
    bulkDeleteBhusaOutwardSchema,
    getBhusaOutwardListSchema,
    getBhusaOutwardSummarySchema,
} from '../validators/bhusa-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Bhusa Outward Routes
 * Base path: /api/mills/:millId/bhusa-outward
 */

// Get bhusa outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getBhusaOutwardSummarySchema),
    getBhusaOutwardSummaryHandler
)

// Bulk delete bhusa outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteBhusaOutwardSchema),
    bulkDeleteBhusaOutwardHandler
)

// Get bhusa outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getBhusaOutwardListSchema),
    getBhusaOutwardListHandler
)

// Create a new bhusa outward entry
router.post(
    '/',
    authenticate,
    validate(createBhusaOutwardSchema),
    createBhusaOutward
)

// Get bhusa outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getBhusaOutwardByIdSchema),
    getBhusaOutwardByIdHandler
)

// Update a bhusa outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateBhusaOutwardSchema),
    updateBhusaOutwardHandler
)

// Delete a bhusa outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteBhusaOutwardSchema),
    deleteBhusaOutwardHandler
)

export default router
