/**
 * Party Routes
 * ============
 * API routes for party (customer/supplier) operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import partyController from '../controllers/party.controller.js'
import {
    createPartySchema,
    updatePartySchema,
    partyIdParamSchema,
    listPartiesQuerySchema,
    ledgerQuerySchema,
    outstandingQuerySchema,
} from '../validators/party.validator.js'

const router = Router({ mergeParams: true }) // mergeParams to access :millId from parent

// All routes require authentication
router.use(authenticate)

// Ensure user can only access their own mill
router.use(requireSameMill)

// GET /api/v1/mills/:millId/parties/summary - Get party summary (before :partyId routes)
router.get('/summary', partyController.getSummary)

// GET /api/v1/mills/:millId/parties/outstanding - Get outstanding balances
router.get(
    '/outstanding',
    validateRequest(outstandingQuerySchema),
    partyController.getOutstanding
)

// GET /api/v1/mills/:millId/parties - List all parties
router.get('/', validateRequest(listPartiesQuerySchema), partyController.getAll)

// POST /api/v1/mills/:millId/parties - Create new party
router.post(
    '/',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(createPartySchema),
    partyController.create
)

// GET /api/v1/mills/:millId/parties/:partyId - Get party by ID
router.get(
    '/:partyId',
    validateRequest(partyIdParamSchema),
    partyController.getById
)

// PUT /api/v1/mills/:millId/parties/:partyId - Update party
router.put(
    '/:partyId',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(partyIdParamSchema),
    validateRequest(updatePartySchema),
    partyController.update
)

// DELETE /api/v1/mills/:millId/parties/:partyId - Delete party
router.delete(
    '/:partyId',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(partyIdParamSchema),
    partyController.delete
)

// PATCH /api/v1/mills/:millId/parties/:partyId/toggle-status - Toggle status
router.patch(
    '/:partyId/toggle-status',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(partyIdParamSchema),
    partyController.toggleStatus
)

// GET /api/v1/mills/:millId/parties/:partyId/ledger - Get party ledger
router.get(
    '/:partyId/ledger',
    validateRequest(ledgerQuerySchema),
    partyController.getLedger
)

export default router
