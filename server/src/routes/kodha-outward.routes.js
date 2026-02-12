import { Router } from 'express'
import {
    createKodhaOutward,
    getKodhaOutwardByIdHandler,
    getKodhaOutwardListHandler,
    getKodhaOutwardSummaryHandler,
    updateKodhaOutwardHandler,
    deleteKodhaOutwardHandler,
    bulkDeleteKodhaOutwardHandler,
} from '../controllers/kodha-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createKodhaOutwardSchema,
    updateKodhaOutwardSchema,
    getKodhaOutwardByIdSchema,
    deleteKodhaOutwardSchema,
    bulkDeleteKodhaOutwardSchema,
    getKodhaOutwardListSchema,
    getKodhaOutwardSummarySchema,
} from '../validators/kodha-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Kodha Outward Routes
 * Base path: /api/mills/:millId/kodha-outward
 */

// Get kodha outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getKodhaOutwardSummarySchema),
    getKodhaOutwardSummaryHandler
)

// Bulk delete kodha outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteKodhaOutwardSchema),
    bulkDeleteKodhaOutwardHandler
)

// Get kodha outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getKodhaOutwardListSchema),
    getKodhaOutwardListHandler
)

// Create a new kodha outward entry
router.post(
    '/',
    authenticate,
    validate(createKodhaOutwardSchema),
    createKodhaOutward
)

// Get kodha outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getKodhaOutwardByIdSchema),
    getKodhaOutwardByIdHandler
)

// Update a kodha outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateKodhaOutwardSchema),
    updateKodhaOutwardHandler
)

// Delete a kodha outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteKodhaOutwardSchema),
    deleteKodhaOutwardHandler
)

export default router
