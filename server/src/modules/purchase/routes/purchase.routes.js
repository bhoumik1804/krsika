/**
 * Purchase Routes
 * ================
 * API routes for purchase operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import purchaseController from '../controllers/purchase.controller.js'
import {
    createPurchaseSchema,
    updatePurchaseSchema,
    recordPaymentSchema,
    purchaseIdParamSchema,
    millIdParamSchema,
    listPurchasesQuerySchema,
    summaryQuerySchema,
} from '../validators/purchase.validator.js'

const router = Router({ mergeParams: true }) // mergeParams to access :millId from parent

// All routes require authentication
router.use(authenticate)

// Ensure user can only access their own mill
router.use(requireSameMill)

// GET /api/v1/mills/:millId/purchases/summary - Get purchase summary (before :purchaseId route)
router.get(
    '/summary',
    validateRequest(summaryQuerySchema),
    purchaseController.getSummary
)

// GET /api/v1/mills/:millId/purchases - List all purchases
router.get(
    '/',
    validateRequest(listPurchasesQuerySchema),
    purchaseController.getAll
)

// POST /api/v1/mills/:millId/purchases - Create new purchase
router.post(
    '/',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(createPurchaseSchema),
    purchaseController.create
)

// GET /api/v1/mills/:millId/purchases/:purchaseId - Get purchase by ID
router.get(
    '/:purchaseId',
    validateRequest(purchaseIdParamSchema),
    purchaseController.getById
)

// PUT /api/v1/mills/:millId/purchases/:purchaseId - Update purchase
router.put(
    '/:purchaseId',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(purchaseIdParamSchema),
    validateRequest(updatePurchaseSchema),
    purchaseController.update
)

// DELETE /api/v1/mills/:millId/purchases/:purchaseId - Delete purchase
router.delete(
    '/:purchaseId',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(purchaseIdParamSchema),
    purchaseController.delete
)

// POST /api/v1/mills/:millId/purchases/:purchaseId/payment - Record payment
router.post(
    '/:purchaseId/payment',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(purchaseIdParamSchema),
    validateRequest(recordPaymentSchema),
    purchaseController.recordPayment
)

export default router
