import { Router } from 'express'
import {
    createFrkOutward,
    getFrkOutwardByIdHandler,
    getFrkOutwardListHandler,
    getFrkOutwardSummaryHandler,
    updateFrkOutwardHandler,
    deleteFrkOutwardHandler,
    bulkDeleteFrkOutwardHandler,
} from '../controllers/frk-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createFrkOutwardSchema,
    updateFrkOutwardSchema,
    getFrkOutwardByIdSchema,
    deleteFrkOutwardSchema,
    bulkDeleteFrkOutwardSchema,
    listFrkOutwardSchema,
    summaryFrkOutwardSchema,
} from '../validators/frk-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * FRK Outward Routes
 * Base path: /api/mills/:millId/frk-outward
 */

// Get frk outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(summaryFrkOutwardSchema),
    getFrkOutwardSummaryHandler
)

// Bulk delete frk outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteFrkOutwardSchema),
    bulkDeleteFrkOutwardHandler
)

// Get frk outward list with pagination
router.get(
    '/',
    authenticate,
    validate(listFrkOutwardSchema),
    getFrkOutwardListHandler
)

// Create a new frk outward entry
router.post(
    '/',
    authenticate,
    validate(createFrkOutwardSchema),
    createFrkOutward
)

// Get frk outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getFrkOutwardByIdSchema),
    getFrkOutwardByIdHandler
)

// Update a frk outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateFrkOutwardSchema),
    updateFrkOutwardHandler
)

// Delete a frk outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteFrkOutwardSchema),
    deleteFrkOutwardHandler
)

export default router
