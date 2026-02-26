import express from 'express'
import { ROLES } from '../constants/user.roles.enum.js'
import {
    createStaff,
    getStaffByIdHandler,
    getStaffListHandler,
    getStaffSummaryHandler,
    updateStaffHandler,
    deleteStaffHandler,
    bulkDeleteStaffHandler,
} from '../controllers/staff.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/roleGuard.js'
import { validate } from '../middlewares/validate.js'
import {
    createStaffSchema,
    updateStaffSchema,
    getStaffByIdSchema,
    deleteStaffSchema,
    bulkDeleteStaffSchema,
    listStaffSchema,
    staffSummarySchema,
} from '../validators/staff.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication and either mill-admin or mill-staff role
router.use(authenticate)
router.use(requireRole(ROLES.MILL_ADMIN, ROLES.MILL_STAFF))

/**
 * Staff Routes (Mill Admin)
 * Base path: /api/mills/:millId/staff
 */

// GET /api/mills/:millId/staff/summary - Get summary statistics
router.get('/summary', validate(staffSummarySchema), getStaffSummaryHandler)

// GET /api/mills/:millId/staff - Get list with pagination
router.get('/', validate(listStaffSchema), getStaffListHandler)

// GET /api/mills/:millId/staff/:id - Get by ID
router.get('/:id', validate(getStaffByIdSchema), getStaffByIdHandler)

// POST /api/mills/:millId/staff - Create new staff member
router.post('/', validate(createStaffSchema), createStaff)

// PUT /api/mills/:millId/staff/:id - Update staff member
router.put('/:id', validate(updateStaffSchema), updateStaffHandler)

// DELETE /api/mills/:millId/staff/:id - Delete staff member
router.delete('/:id', validate(deleteStaffSchema), deleteStaffHandler)

// DELETE /api/mills/:millId/staff/bulk - Bulk delete staff members
router.delete('/bulk', validate(bulkDeleteStaffSchema), bulkDeleteStaffHandler)

export default router
