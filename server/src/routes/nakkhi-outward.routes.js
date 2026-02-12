import { Router } from 'express'
import {
    createNakkhiOutward,
    getNakkhiOutwardByIdHandler,
    getNakkhiOutwardListHandler,
    getNakkhiOutwardSummaryHandler,
    updateNakkhiOutwardHandler,
    deleteNakkhiOutwardHandler,
    bulkDeleteNakkhiOutwardHandler,
} from '../controllers/nakkhi-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createNakkhiOutwardSchema,
    updateNakkhiOutwardSchema,
    getNakkhiOutwardByIdSchema,
    deleteNakkhiOutwardSchema,
    bulkDeleteNakkhiOutwardSchema,
    getNakkhiOutwardListSchema,
    getNakkhiOutwardSummarySchema,
} from '../validators/nakkhi-outward.validator.js'

const router = Router({ mergeParams: true })

/**
 * Nakkhi Outward Routes
 * Base path: /api/mills/:millId/nakkhi-outward
 */

// Get nakkhi outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(getNakkhiOutwardSummarySchema),
    getNakkhiOutwardSummaryHandler
)

// Bulk delete nakkhi outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteNakkhiOutwardSchema),
    bulkDeleteNakkhiOutwardHandler
)

// Get nakkhi outward list with pagination
router.get(
    '/',
    authenticate,
    validate(getNakkhiOutwardListSchema),
    getNakkhiOutwardListHandler
)

// Create a new nakkhi outward entry
router.post(
    '/',
    authenticate,
    validate(createNakkhiOutwardSchema),
    createNakkhiOutward
)

// Get nakkhi outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getNakkhiOutwardByIdSchema),
    getNakkhiOutwardByIdHandler
)

// Update a nakkhi outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateNakkhiOutwardSchema),
    updateNakkhiOutwardHandler
)

// Delete a nakkhi outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteNakkhiOutwardSchema),
    deleteNakkhiOutwardHandler
)

export default router
