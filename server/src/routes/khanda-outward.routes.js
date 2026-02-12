import { Router } from 'express'
import {
    createKhandaOutward,
    getKhandaOutwardByIdHandler,
    getKhandaOutwardListHandler,
    getKhandaOutwardSummaryHandler,
    updateKhandaOutwardHandler,
    deleteKhandaOutwardHandler,
    bulkDeleteKhandaOutwardHandler,
} from '../controllers/khanda-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createKhandaOutwardSchema,
    updateKhandaOutwardSchema,
    getKhandaOutwardByIdSchema,
    deleteKhandaOutwardSchema,
    bulkDeleteKhandaOutwardSchema,
    getKhandaOutwardListSchema,
    getKhandaOutwardSummarySchema,
} from '../validators/khanda-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Khanda Outward Routes
 * Base path: /api/mills/:millId/khanda-outward
 */

// Get khanda outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getKhandaOutwardSummarySchema),
    getKhandaOutwardSummaryHandler
)

// Bulk delete khanda outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteKhandaOutwardSchema),
    bulkDeleteKhandaOutwardHandler
)

// Get khanda outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getKhandaOutwardListSchema),
    getKhandaOutwardListHandler
)

// Create a new khanda outward entry
router.post(
    '/',
    authenticate,
    validate(createKhandaOutwardSchema),
    createKhandaOutward
)

// Get khanda outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getKhandaOutwardByIdSchema),
    getKhandaOutwardByIdHandler
)

// Update a khanda outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateKhandaOutwardSchema),
    updateKhandaOutwardHandler
)

// Delete a khanda outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteKhandaOutwardSchema),
    deleteKhandaOutwardHandler
)

export default router
