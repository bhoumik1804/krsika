import { Router } from 'express'
import {
    createSilkyKodhaOutward,
    getSilkyKodhaOutwardByIdHandler,
    getSilkyKodhaOutwardListHandler,
    getSilkyKodhaOutwardSummaryHandler,
    updateSilkyKodhaOutwardHandler,
    deleteSilkyKodhaOutwardHandler,
    bulkDeleteSilkyKodhaOutwardHandler,
} from '../controllers/silky-kodha-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createSilkyKodhaOutwardSchema,
    updateSilkyKodhaOutwardSchema,
    getSilkyKodhaOutwardByIdSchema,
    deleteSilkyKodhaOutwardSchema,
    bulkDeleteSilkyKodhaOutwardSchema,
    getSilkyKodhaOutwardListSchema,
    getSilkyKodhaOutwardSummarySchema,
} from '../validators/silky-kodha-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Silky Kodha Outward Routes
 * Base path: /api/mills/:millId/silky-kodha-outward
 */

// Get silky kodha outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getSilkyKodhaOutwardSummarySchema),
    getSilkyKodhaOutwardSummaryHandler
)

// Bulk delete silky kodha outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteSilkyKodhaOutwardSchema),
    bulkDeleteSilkyKodhaOutwardHandler
)

// Get silky kodha outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getSilkyKodhaOutwardListSchema),
    getSilkyKodhaOutwardListHandler
)

// Create a new silky kodha outward entry
router.post(
    '/',
    authenticate,
    validate(createSilkyKodhaOutwardSchema),
    createSilkyKodhaOutward
)

// Get silky kodha outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getSilkyKodhaOutwardByIdSchema),
    getSilkyKodhaOutwardByIdHandler
)

// Update a silky kodha outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateSilkyKodhaOutwardSchema),
    updateSilkyKodhaOutwardHandler
)

// Delete a silky kodha outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteSilkyKodhaOutwardSchema),
    deleteSilkyKodhaOutwardHandler
)

export default router
