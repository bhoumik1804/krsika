import { Router } from 'express'
import {
    createBalanceLiftingParty,
    getBalanceLiftingPartyByIdHandler,
    getBalanceLiftingPartyListHandler,
    getBalanceLiftingPartySummaryHandler,
    updateBalanceLiftingPartyHandler,
    deleteBalanceLiftingPartyHandler,
    bulkDeleteBalanceLiftingPartyHandler,
} from '../controllers/balance-lifting-party.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createBalanceLiftingPartySchema,
    updateBalanceLiftingPartySchema,
    getBalanceLiftingPartyByIdSchema,
    deleteBalanceLiftingPartySchema,
    bulkDeleteBalanceLiftingPartySchema,
    getBalanceLiftingPartyListSchema,
    getBalanceLiftingPartySummarySchema,
} from '../validators/balance-lifting-party.validator.js'

const router = Router({ mergeParams: true })

/**
 * Balance Lifting Party Routes
 * Base path: /api/mills/:millId/balance-lifting-party
 */

// Get balance lifting party list with pagination
router.get(
    '/',
    authenticate,
    validate(getBalanceLiftingPartyListSchema),
    getBalanceLiftingPartyListHandler
)

// Get balance lifting party summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getBalanceLiftingPartySummarySchema),
    getBalanceLiftingPartySummaryHandler
)

// Get balance lifting party entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getBalanceLiftingPartyByIdSchema),
    getBalanceLiftingPartyByIdHandler
)

// Create a new balance lifting party entry
router.post(
    '/',
    authenticate,
    validate(createBalanceLiftingPartySchema),
    createBalanceLiftingParty
)

// Update a balance lifting party entry
router.put(
    '/:id',
    authenticate,
    validate(updateBalanceLiftingPartySchema),
    updateBalanceLiftingPartyHandler
)

// Bulk delete balance lifting party entries
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteBalanceLiftingPartySchema),
    bulkDeleteBalanceLiftingPartyHandler
)

// Delete a balance lifting party entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteBalanceLiftingPartySchema),
    deleteBalanceLiftingPartyHandler
)

export default router
