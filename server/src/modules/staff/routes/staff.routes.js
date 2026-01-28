/**
 * Staff Routes
 * ============
 * API routes for staff management operations
 */
import { Router } from 'express'
import { USER_ROLES } from '../../../shared/constants/roles.js'
import { authenticate } from '../../../shared/middlewares/authenticate.js'
import {
    authorize,
    requireSameMill,
} from '../../../shared/middlewares/authorize.js'
import { validateRequest } from '../../../shared/middlewares/validate-request.js'
import staffController from '../controllers/staff.controller.js'
import {
    createStaffSchema,
    updateStaffSchema,
    staffIdParamSchema,
    listStaffQuerySchema,
    resetPasswordSchema,
    updatePermissionsSchema,
} from '../validators/staff.validator.js'

const router = Router({ mergeParams: true }) // mergeParams to access :millId from parent

// All routes require authentication
router.use(authenticate)

// Ensure user can only access their own mill
router.use(requireSameMill)

// Only Mill Admin can manage staff
router.use(authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN))

// GET /api/v1/mills/:millId/staff/summary - Get staff summary (before :staffId routes)
router.get('/summary', staffController.getSummary)

// GET /api/v1/mills/:millId/staff - List all staff
router.get('/', validateRequest(listStaffQuerySchema), staffController.getAll)

// POST /api/v1/mills/:millId/staff - Create new staff
router.post('/', validateRequest(createStaffSchema), staffController.create)

// GET /api/v1/mills/:millId/staff/:staffId - Get staff by ID
router.get(
    '/:staffId',
    validateRequest(staffIdParamSchema),
    staffController.getById
)

// PUT /api/v1/mills/:millId/staff/:staffId - Update staff
router.put(
    '/:staffId',
    validateRequest(staffIdParamSchema),
    validateRequest(updateStaffSchema),
    staffController.update
)

// DELETE /api/v1/mills/:millId/staff/:staffId - Delete staff
router.delete(
    '/:staffId',
    validateRequest(staffIdParamSchema),
    staffController.delete
)

// PATCH /api/v1/mills/:millId/staff/:staffId/toggle-status - Toggle staff status
router.patch(
    '/:staffId/toggle-status',
    validateRequest(staffIdParamSchema),
    staffController.toggleStatus
)

// POST /api/v1/mills/:millId/staff/:staffId/reset-password - Reset password
router.post(
    '/:staffId/reset-password',
    validateRequest(resetPasswordSchema),
    staffController.resetPassword
)

// PUT /api/v1/mills/:millId/staff/:staffId/permissions - Update permissions
router.put(
    '/:staffId/permissions',
    validateRequest(updatePermissionsSchema),
    staffController.updatePermissions
)

export default router
