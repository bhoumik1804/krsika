import { Router } from 'express'
import {
    createLabourOutward,
    getLabourOutwardByIdHandler,
    getLabourOutwardListHandler,
    getLabourOutwardSummaryHandler,
    updateLabourOutwardHandler,
    deleteLabourOutwardHandler,
    bulkDeleteLabourOutwardHandler,
} from '../controllers/labour-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createLabourOutwardSchema,
    updateLabourOutwardSchema,
    getLabourOutwardByIdSchema,
    deleteLabourOutwardSchema,
    bulkDeleteLabourOutwardSchema,
    getLabourOutwardListSchema,
    getLabourOutwardSummarySchema,
} from '../validators/labour-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Labour Outward Routes
 * Base path: /api/mills/:millId/labour-outward
 */

// Get labour outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getLabourOutwardListSchema),
    getLabourOutwardListHandler
)

// Get labour outward summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getLabourOutwardSummarySchema),
    getLabourOutwardSummaryHandler
)

// Get labour outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getLabourOutwardByIdSchema),
    getLabourOutwardByIdHandler
)

// Create a new labour outward entry
router.post(
    '/',
    authenticate,
    validate(createLabourOutwardSchema),
    createLabourOutward
)

// Update a labour outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateLabourOutwardSchema),
    updateLabourOutwardHandler
)

// Bulk delete labour outward entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteLabourOutwardSchema),
    bulkDeleteLabourOutwardHandler
)

// Delete a labour outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteLabourOutwardSchema),
    deleteLabourOutwardHandler
)

export default router
