/**
 * Broker Routes
 * =============
 * API routes for broker operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import brokerController from '../controllers/broker.controller.js'
import {
    createBrokerSchema,
    updateBrokerSchema,
    brokerIdParamSchema,
    listBrokersQuerySchema,
    recordPaymentSchema,
} from '../validators/broker.validator.js'

const router = Router({ mergeParams: true }) // mergeParams to access :millId from parent

// All routes require authentication
router.use(authenticate)

// Ensure user can only access their own mill
router.use(requireSameMill)

// GET /api/v1/mills/:millId/brokers/commission-summary - Get commission summary (before :brokerId routes)
router.get('/commission-summary', brokerController.getCommissionSummary)

// GET /api/v1/mills/:millId/brokers - List all brokers
router.get(
    '/',
    validateRequest(listBrokersQuerySchema),
    brokerController.getAll
)

// POST /api/v1/mills/:millId/brokers - Create new broker
router.post(
    '/',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(createBrokerSchema),
    brokerController.create
)

// GET /api/v1/mills/:millId/brokers/:brokerId - Get broker by ID
router.get(
    '/:brokerId',
    validateRequest(brokerIdParamSchema),
    brokerController.getById
)

// PUT /api/v1/mills/:millId/brokers/:brokerId - Update broker
router.put(
    '/:brokerId',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(brokerIdParamSchema),
    validateRequest(updateBrokerSchema),
    brokerController.update
)

// DELETE /api/v1/mills/:millId/brokers/:brokerId - Delete/deactivate broker
router.delete(
    '/:brokerId',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(brokerIdParamSchema),
    brokerController.delete
)

// PATCH /api/v1/mills/:millId/brokers/:brokerId/toggle-status - Toggle status
router.patch(
    '/:brokerId/toggle-status',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(brokerIdParamSchema),
    brokerController.toggleStatus
)

// POST /api/v1/mills/:millId/brokers/:brokerId/payment - Record payment
router.post(
    '/:brokerId/payment',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(recordPaymentSchema),
    brokerController.recordPayment
)

export default router
