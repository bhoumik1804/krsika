/**
 * Stock Routes
 * ============
 * API routes for stock operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import stockController from '../controllers/stock.controller.js'
import {
    initializeStockSchema,
    updateThresholdSchema,
    stockIdParamSchema,
    listStocksQuerySchema,
    stockTransferSchema,
    stockAdjustmentSchema,
    checkAvailabilitySchema,
} from '../validators/stock.validator.js'

const router = Router({ mergeParams: true }) // mergeParams to access :millId from parent

// All routes require authentication
router.use(authenticate)

// Ensure user can only access their own mill
router.use(requireSameMill)

// GET /api/v1/mills/:millId/stocks/summary - Get stock summary (before :stockId routes)
router.get('/summary', stockController.getSummary)

// GET /api/v1/mills/:millId/stocks/alerts - Get low stock alerts
router.get('/alerts', stockController.getLowStockAlerts)

// GET /api/v1/mills/:millId/stocks/availability - Check stock availability
router.get(
    '/availability',
    validateRequest(checkAvailabilitySchema),
    stockController.checkAvailability
)

// POST /api/v1/mills/:millId/stocks/initialize-all - Initialize all stock types
router.post(
    '/initialize-all',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    stockController.initializeAll
)

// POST /api/v1/mills/:millId/stocks/transfer - Stock transfer
router.post(
    '/transfer',
    authorize(
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.MILL_ADMIN,
        USER_ROLES.MILL_STAFF
    ),
    validateRequest(stockTransferSchema),
    stockController.transfer
)

// GET /api/v1/mills/:millId/stocks - List all stocks
router.get('/', validateRequest(listStocksQuerySchema), stockController.getAll)

// POST /api/v1/mills/:millId/stocks - Initialize a stock type
router.post(
    '/',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(initializeStockSchema),
    stockController.initialize
)

// GET /api/v1/mills/:millId/stocks/:stockId - Get stock by ID
router.get(
    '/:stockId',
    validateRequest(stockIdParamSchema),
    stockController.getById
)

// PATCH /api/v1/mills/:millId/stocks/:stockId/threshold - Update threshold
router.patch(
    '/:stockId/threshold',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(updateThresholdSchema),
    stockController.updateThreshold
)

// POST /api/v1/mills/:millId/stocks/:stockId/adjust - Adjust stock manually
router.post(
    '/:stockId/adjust',
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    validateRequest(stockAdjustmentSchema),
    stockController.adjust
)

export default router
