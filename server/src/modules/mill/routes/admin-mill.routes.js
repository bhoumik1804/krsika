/**
 * Admin Mill Routes
 * ==================
 * API routes for super admin mill management
 */
import { Router } from 'express'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import { requireSuperAdmin } from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import millController from '../controllers/mill.controller.js'
import {
    createMillSchema,
    updateMillSchema,
    updateMillStatusSchema,
    millIdParamSchema,
    listMillsQuerySchema,
} from '../validators/mill.validator.js'

const router = Router()

// All routes require authentication and super admin role
router.use(authenticate)
router.use(requireSuperAdmin)

// GET /api/v1/admin/mills - Get all mills
router.get('/', validateRequest(listMillsQuerySchema), millController.getAll)

// POST /api/v1/admin/mills - Create a new mill
router.post('/', validateRequest(createMillSchema), millController.create)

// GET /api/v1/admin/mills/:millId - Get mill by ID (admin view)
router.get(
    '/:millId',
    validateRequest(millIdParamSchema),
    millController.getById
)

// PUT /api/v1/admin/mills/:millId - Update mill
router.put(
    '/:millId',
    validateRequest(millIdParamSchema),
    validateRequest(updateMillSchema),
    millController.update
)

// PATCH /api/v1/admin/mills/:millId/status - Update mill status
router.patch(
    '/:millId/status',
    validateRequest(millIdParamSchema),
    validateRequest(updateMillStatusSchema),
    millController.updateStatus
)

// DELETE /api/v1/admin/mills/:millId - Delete mill
router.delete(
    '/:millId',
    validateRequest(millIdParamSchema),
    millController.delete
)

// GET /api/v1/admin/mills/:millId/stats - Get mill statistics
router.get(
    '/:millId/stats',
    validateRequest(millIdParamSchema),
    millController.getStats
)

export default router
