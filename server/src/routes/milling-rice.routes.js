import { Router } from 'express'
import {
    createMillingRice,
    getMillingRiceByIdHandler,
    getMillingRiceListHandler,
    getMillingRiceSummaryHandler,
    updateMillingRiceHandler,
    deleteMillingRiceHandler,
    bulkDeleteMillingRiceHandler,
} from '../controllers/milling-rice.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createMillingRiceSchema,
    updateMillingRiceSchema,
    getMillingRiceByIdSchema,
    deleteMillingRiceSchema,
    bulkDeleteMillingRiceSchema,
    getMillingRiceListSchema,
    getMillingRiceSummarySchema,
} from '../validators/milling-rice.validator.js'

const router = Router({ mergeParams: true })

/**
 * Milling Rice Routes
 * Base path: /api/mills/:millId/milling-rice
 */

// Get milling rice list with pagination
router.get(
    '/',
    authenticate,
    validate(getMillingRiceListSchema),
    getMillingRiceListHandler
)

// Get milling rice summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getMillingRiceSummarySchema),
    getMillingRiceSummaryHandler
)

// Get milling rice entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getMillingRiceByIdSchema),
    getMillingRiceByIdHandler
)

// Create a new milling rice entry
router.post(
    '/',
    authenticate,
    validate(createMillingRiceSchema),
    createMillingRice
)

// Update a milling rice entry
router.put(
    '/:id',
    authenticate,
    validate(updateMillingRiceSchema),
    updateMillingRiceHandler
)

// Bulk delete milling rice entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteMillingRiceSchema),
    bulkDeleteMillingRiceHandler
)

// Delete a milling rice entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteMillingRiceSchema),
    deleteMillingRiceHandler
)

export default router
