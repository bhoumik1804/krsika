import { Router } from 'express'
import {
    createOutwardBalanceParty,
    getOutwardBalancePartyByIdHandler,
    getOutwardBalancePartyListHandler,
    getOutwardBalancePartySummaryHandler,
    updateOutwardBalancePartyHandler,
    deleteOutwardBalancePartyHandler,
    bulkDeleteOutwardBalancePartyHandler,
} from '../controllers/outward-balance-party.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createOutwardBalancePartySchema,
    updateOutwardBalancePartySchema,
    getOutwardBalancePartyByIdSchema,
    deleteOutwardBalancePartySchema,
    bulkDeleteOutwardBalancePartySchema,
    getOutwardBalancePartyListSchema,
    getOutwardBalancePartySummarySchema,
} from '../validators/outward-balance-party.validator.js'

const router = Router({ mergeParams: true })

/**
 * Outward Balance Party Routes
 * Base path: /api/mills/:millId/outward-balance-party
 */

// Get outward balance party list with pagination
router.get(
    '/',
    authenticate,
    validate(getOutwardBalancePartyListSchema),
    getOutwardBalancePartyListHandler
)

// Get outward balance party summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getOutwardBalancePartySummarySchema),
    getOutwardBalancePartySummaryHandler
)

// Get outward balance party entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getOutwardBalancePartyByIdSchema),
    getOutwardBalancePartyByIdHandler
)

// Create a new outward balance party entry
router.post(
    '/',
    authenticate,
    validate(createOutwardBalancePartySchema),
    createOutwardBalanceParty
)

// Update an outward balance party entry
router.put(
    '/:id',
    authenticate,
    validate(updateOutwardBalancePartySchema),
    updateOutwardBalancePartyHandler
)

// Bulk delete outward balance party entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteOutwardBalancePartySchema),
    bulkDeleteOutwardBalancePartyHandler
)

// Delete an outward balance party entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteOutwardBalancePartySchema),
    deleteOutwardBalancePartyHandler
)

export default router
