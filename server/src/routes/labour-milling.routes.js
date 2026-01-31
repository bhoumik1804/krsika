import { Router } from 'express'
import {
    createLabourMilling,
    getLabourMillingByIdHandler,
    getLabourMillingListHandler,
    getLabourMillingSummaryHandler,
    updateLabourMillingHandler,
    deleteLabourMillingHandler,
    bulkDeleteLabourMillingHandler,
} from '../controllers/labour-milling.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createLabourMillingSchema,
    updateLabourMillingSchema,
    getLabourMillingByIdSchema,
    deleteLabourMillingSchema,
    bulkDeleteLabourMillingSchema,
    getLabourMillingListSchema,
    getLabourMillingSummarySchema,
} from '../validators/labour-milling.validator.js'

const router = Router({ mergeParams: true })

/**
 * Labour Milling Routes
 * Base path: /api/mills/:millId/labour-milling
 */

// Get labour milling list with pagination
router.get(
    '/',
    authenticate,
    validate(getLabourMillingListSchema),
    getLabourMillingListHandler
)

// Get labour milling summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getLabourMillingSummarySchema),
    getLabourMillingSummaryHandler
)

// Get labour milling entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getLabourMillingByIdSchema),
    getLabourMillingByIdHandler
)

// Create a new labour milling entry
router.post(
    '/',
    authenticate,
    validate(createLabourMillingSchema),
    createLabourMilling
)

// Update a labour milling entry
router.put(
    '/:id',
    authenticate,
    validate(updateLabourMillingSchema),
    updateLabourMillingHandler
)

// Bulk delete labour milling entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteLabourMillingSchema),
    bulkDeleteLabourMillingHandler
)

// Delete a labour milling entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteLabourMillingSchema),
    deleteLabourMillingHandler
)

export default router
