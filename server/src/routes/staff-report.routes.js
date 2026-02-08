import { Router } from 'express'
import {
    createStaffReport,
    getStaffReportByIdHandler,
    getStaffReportListHandler,
    getStaffReportSummaryHandler,
    updateStaffReportHandler,
    deleteStaffReportHandler,
    bulkDeleteStaffReportHandler,
} from '../controllers/staff-report.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createStaffReportSchema,
    updateStaffReportSchema,
    getStaffReportByIdSchema,
    deleteStaffReportSchema,
    bulkDeleteStaffReportSchema,
    getStaffReportListSchema,
    getStaffReportSummarySchema,
} from '../validators/staff-report.validator.js'

const router = Router({ mergeParams: true })

/**
 * Staff Routes (uses User model with MILL_STAFF role)
 * Base path: /api/mills/:millId/staff-reports
 */

// Get staff list with pagination
router.get(
    '/',
    authenticate,
    validate(getStaffReportListSchema),
    getStaffReportListHandler
)

// Get staff summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getStaffReportSummarySchema),
    getStaffReportSummaryHandler
)

// Get staff by ID
router.get(
    '/:id',
    authenticate,
    validate(getStaffReportByIdSchema),
    getStaffReportByIdHandler
)

// Create a new staff member
router.post(
    '/',
    authenticate,
    validate(createStaffReportSchema),
    createStaffReport
)

// Update a staff member
router.put(
    '/:id',
    authenticate,
    validate(updateStaffReportSchema),
    updateStaffReportHandler
)

// Bulk delete staff members
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteStaffReportSchema),
    bulkDeleteStaffReportHandler
)

// Delete a staff member
router.delete(
    '/:id',
    authenticate,
    validate(deleteStaffReportSchema),
    deleteStaffReportHandler
)

export default router
