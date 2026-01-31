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
 * Staff Report Routes
 * Base path: /api/mills/:millId/staff-reports
 */

// Get staff report list with pagination
router.get(
    '/',
    authenticate,
    validate(getStaffReportListSchema),
    getStaffReportListHandler
)

// Get staff report summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getStaffReportSummarySchema),
    getStaffReportSummaryHandler
)

// Get staff report by ID
router.get(
    '/:id',
    authenticate,
    validate(getStaffReportByIdSchema),
    getStaffReportByIdHandler
)

// Create a new staff report
router.post(
    '/',
    authenticate,
    validate(createStaffReportSchema),
    createStaffReport
)

// Update a staff report
router.put(
    '/:id',
    authenticate,
    validate(updateStaffReportSchema),
    updateStaffReportHandler
)

// Bulk delete staff reports
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteStaffReportSchema),
    bulkDeleteStaffReportHandler
)

// Delete a staff report
router.delete(
    '/:id',
    authenticate,
    validate(deleteStaffReportSchema),
    deleteStaffReportHandler
)

export default router
