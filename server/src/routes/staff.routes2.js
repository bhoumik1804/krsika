import express from 'express'
import {
    createStaff,
    getStaffByIdHandler,
    getStaffListHandler,
    getStaffSummaryHandler,
    updateStaffHandler,
    deleteStaffHandler,
    bulkDeleteStaffHandler,
    markAttendanceHandler,
    bulkMarkAttendanceHandler,
    getAttendanceSummaryHandler,
    getBulkAttendanceSummaryHandler,
} from '../controllers/staff.controller2.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createStaffSchema,
    updateStaffSchema,
    getStaffByIdSchema,
    deleteStaffSchema,
    bulkDeleteStaffSchema,
    listStaffSchema,
    summaryStaffSchema,
    markAttendanceSchema,
    bulkMarkAttendanceSchema,
    attendanceSummarySchema,
    bulkAttendanceSummarySchema,
} from '../validators/staff.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Staff Routes
 * Base path: /api/mills/:millId/staff
 */

// GET /api/mills/:millId/staff/summary - Get summary statistics
router.get('/summary', validate(summaryStaffSchema), getStaffSummaryHandler)

// GET /api/mills/:millId/staff/attendance/summary - Get bulk attendance summary
router.get(
    '/attendance/summary',
    validate(bulkAttendanceSummarySchema),
    getBulkAttendanceSummaryHandler
)

// POST /api/mills/:millId/staff/attendance/bulk - Bulk mark attendance
router.post(
    '/attendance/bulk',
    validate(bulkMarkAttendanceSchema),
    bulkMarkAttendanceHandler
)

// GET /api/mills/:millId/staff - Get list with pagination
router.get('/', validate(listStaffSchema), getStaffListHandler)

// GET /api/mills/:millId/staff/:id - Get by ID
router.get('/:id', validate(getStaffByIdSchema), getStaffByIdHandler)

// GET /api/mills/:millId/staff/:id/attendance/summary - Get attendance summary for staff
router.get(
    '/:id/attendance/summary',
    validate(attendanceSummarySchema),
    getAttendanceSummaryHandler
)

// POST /api/mills/:millId/staff - Create new staff member
router.post('/', validate(createStaffSchema), createStaff)

// POST /api/mills/:millId/staff/:id/attendance - Mark attendance
router.post(
    '/:id/attendance',
    validate(markAttendanceSchema),
    markAttendanceHandler
)

// PUT /api/mills/:millId/staff/:id - Update staff member
router.put('/:id', validate(updateStaffSchema), updateStaffHandler)

// DELETE /api/mills/:millId/staff/bulk - Bulk delete staff members
router.delete('/bulk', validate(bulkDeleteStaffSchema), bulkDeleteStaffHandler)

// DELETE /api/mills/:millId/staff/:id - Delete staff member
router.delete('/:id', validate(deleteStaffSchema), deleteStaffHandler)

export default router
