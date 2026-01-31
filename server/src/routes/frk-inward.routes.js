import { Router } from 'express'
import {
    createFrkInward,
    getFrkInwardByIdHandler,
    getFrkInwardListHandler,
    getFrkInwardSummaryHandler,
    updateFrkInwardHandler,
    deleteFrkInwardHandler,
    bulkDeleteFrkInwardHandler,
} from '../controllers/frk-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createFrkInwardSchema,
    updateFrkInwardSchema,
    getFrkInwardByIdSchema,
    deleteFrkInwardSchema,
    bulkDeleteFrkInwardSchema,
    getFrkInwardListSchema,
    getFrkInwardSummarySchema,
} from '../validators/frk-inward.validator.js'

const router = Router({ mergeParams: true })

/**
 * FRK Inward Routes
 * Base path: /api/mills/:millId/frk-inward
 */

// Get FRK inward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getFrkInwardSummarySchema),
    getFrkInwardSummaryHandler
)

// Bulk delete FRK inward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteFrkInwardSchema),
    bulkDeleteFrkInwardHandler
)

// Get FRK inward list with pagination
router.get(
    '/',
    authenticate,
    validate(getFrkInwardListSchema),
    getFrkInwardListHandler
)

// Create a new FRK inward entry
router.post('/', authenticate, validate(createFrkInwardSchema), createFrkInward)

// Get FRK inward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getFrkInwardByIdSchema),
    getFrkInwardByIdHandler
)

// Update a FRK inward entry
router.put(
    '/:id',
    authenticate,
    validate(updateFrkInwardSchema),
    updateFrkInwardHandler
)

// Delete a FRK inward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteFrkInwardSchema),
    deleteFrkInwardHandler
)

export default router
