/**
 * Mill Routes
 * ============
 * API routes for mill operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSuperAdmin,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import millController from '../controllers/mill.controller.js'
import {
    createMillSchema,
    updateMillSchema,
    updateMillStatusSchema,
    updateMillSettingsSchema,
    millIdParamSchema,
    listMillsQuerySchema,
} from '../validators/mill.validator.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

/**
 * Routes accessible by mill users
 */

// GET /api/v1/mills/my-mill - Get current user's mill
router.get('/my-mill', millController.getMyMill)

// GET /api/v1/mills/:millId - Get mill by ID
router.get(
    '/:millId',
    validateRequest(millIdParamSchema),
    requireSameMill,
    millController.getById
)

// GET /api/v1/mills/:millId/stats - Get mill statistics
router.get(
    '/:millId/stats',
    validateRequest(millIdParamSchema),
    requireSameMill,
    millController.getStats
)

// GET /api/v1/mills/:millId/settings - Get mill settings
router.get(
    '/:millId/settings',
    validateRequest(millIdParamSchema),
    requireSameMill,
    millController.getSettings
)

/**
 * Routes for Mill Admin
 */

// PUT /api/v1/mills/:millId - Update mill (Mill Admin only)
router.put(
    '/:millId',
    validateRequest(millIdParamSchema),
    validateRequest(updateMillSchema),
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    requireSameMill,
    millController.update
)

// PUT /api/v1/mills/:millId/settings - Update mill settings
router.put(
    '/:millId/settings',
    validateRequest(millIdParamSchema),
    validateRequest(updateMillSettingsSchema),
    authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN),
    requireSameMill,
    millController.updateSettings
)

export default router
