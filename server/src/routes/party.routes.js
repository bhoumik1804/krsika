import { Router } from 'express'
import {
    createParty,
    getPartyByIdHandler,
    getPartyListHandler,
    getPartySummaryHandler,
    updatePartyHandler,
    deletePartyHandler,
    bulkDeletePartyHandler,
} from '../controllers/party.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPartySchema,
    updatePartySchema,
    getPartyByIdSchema,
    deletePartySchema,
    bulkDeletePartySchema,
    getPartyListSchema,
    getPartySummarySchema,
} from '../validators/party.validator.js'

const router = Router({ mergeParams: true })

/**
 * Party Routes
 * Base path: /api/mills/:millId/parties
 */

// Get party list with pagination
router.get('/', authenticate, validate(getPartyListSchema), getPartyListHandler)

// Get party summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getPartySummarySchema),
    getPartySummaryHandler
)

// Get party by ID
router.get(
    '/:id',
    authenticate,
    validate(getPartyByIdSchema),
    getPartyByIdHandler
)

// Create a new party
router.post('/', authenticate, validate(createPartySchema), createParty)

// Update a party
router.put(
    '/:id',
    authenticate,
    validate(updatePartySchema),
    updatePartyHandler
)

// Bulk delete parties
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeletePartySchema),
    bulkDeletePartyHandler
)

// Delete a party
router.delete(
    '/:id',
    authenticate,
    validate(deletePartySchema),
    deletePartyHandler
)

export default router
