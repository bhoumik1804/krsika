import express from 'express'
import { ROLES } from '../constants/user.roles.enum.js'
import {
    createMill,
    getMillByIdHandler,
    getMillsListHandler,
    getMillsSummaryHandler,
    updateMillHandler,
    verifyMillHandler,
    suspendMillHandler,
    reactivateMillHandler,
    deleteMillHandler,
    bulkDeleteMillsHandler,
} from '../controllers/mills.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/roleGuard.js'
import { validate } from '../middlewares/validate.js'
import {
    createMillSchema,
    updateMillSchema,
    getMillByIdSchema,
    deleteMillSchema,
    bulkDeleteMillsSchema,
    listMillsSchema,
    summaryMillsSchema,
    verifyMillSchema,
    millActionSchema,
} from '../validators/mills.validator.js'

const router = express.Router()

// All routes require authentication and super admin role
router.use(authenticate)
router.use(requireRole(ROLES.SUPER_ADMIN))

/**
 * Mills Routes (Super Admin)
 * Base path: /api/admin/mills
 */

// GET /api/admin/mills/summary - Get summary statistics
router.get('/summary', validate(summaryMillsSchema), getMillsSummaryHandler)

// GET /api/admin/mills - Get list with pagination
router.get('/', validate(listMillsSchema), getMillsListHandler)

// GET /api/admin/mills/:id - Get by ID
router.get('/:id', validate(getMillByIdSchema), getMillByIdHandler)

// POST /api/admin/mills - Create new mill
router.post('/', validate(createMillSchema), createMill)

// PUT /api/admin/mills/:id - Update mill
router.put('/:id', validate(updateMillSchema), updateMillHandler)

// PATCH /api/admin/mills/:id/verify - Verify (approve/reject) mill
router.patch('/:id/verify', validate(verifyMillSchema), verifyMillHandler)

// PATCH /api/admin/mills/:id/suspend - Suspend mill
router.patch('/:id/suspend', validate(millActionSchema), suspendMillHandler)

// PATCH /api/admin/mills/:id/reactivate - Reactivate mill
router.patch(
    '/:id/reactivate',
    validate(millActionSchema),
    reactivateMillHandler
)

// DELETE /api/admin/mills/bulk - Bulk delete mills
router.delete('/bulk', validate(bulkDeleteMillsSchema), bulkDeleteMillsHandler)

// DELETE /api/admin/mills/:id - Delete mill
router.delete('/:id', validate(deleteMillSchema), deleteMillHandler)

export default router
