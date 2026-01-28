/**
 * Sale Routes
 * ============
 * API routes for sale operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import saleController from '../controllers/sale.controller.js'
import {
    createSaleSchema,
    updateSaleSchema,
    recordPaymentSchema,
    saleIdParamSchema,
    listSalesQuerySchema,
    summaryQuerySchema,
} from '../validators/sale.validator.js'

const router = Router({ mergeParams: true }) // mergeParams to access :millId from parent

// All routes require authentication
router.use(authenticate)

// Ensure user can only access their own mill
router.use(requireSameMill)

// GET /api/v1/mills/:millId/sales/summary - Get sale summary (before :saleId route)
router.get(
    '/summary',
    validateRequest(summaryQuerySchema),
    saleController.getSummary
)

// GET /api/v1/mills/:millId/sales - List all sales
router.get('/', validateRequest(listSalesQuerySchema), saleController.getAll)

// POST /api/v1/mills/:millId/sales - Create new sale
router.post(
    '/',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(createSaleSchema),
    saleController.create
)

// GET /api/v1/mills/:millId/sales/:saleId - Get sale by ID
router.get(
    '/:saleId',
    validateRequest(saleIdParamSchema),
    saleController.getById
)

// PUT /api/v1/mills/:millId/sales/:saleId - Update sale
router.put(
    '/:saleId',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(saleIdParamSchema),
    validateRequest(updateSaleSchema),
    saleController.update
)

// DELETE /api/v1/mills/:millId/sales/:saleId - Delete sale
router.delete(
    '/:saleId',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(saleIdParamSchema),
    saleController.delete
)

// POST /api/v1/mills/:millId/sales/:saleId/payment - Record payment
router.post(
    '/:saleId/payment',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(saleIdParamSchema),
    validateRequest(recordPaymentSchema),
    saleController.recordPayment
)

export default router
