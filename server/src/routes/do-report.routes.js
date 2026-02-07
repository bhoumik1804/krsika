import { Router } from 'express'
import {
    createDoReport,
    bulkCreateDoReport,
    getDoReportByIdHandler,
    getDoReportListHandler,
    getDoReportSummaryHandler,
    updateDoReportHandler,
    deleteDoReportHandler,
    bulkDeleteDoReportHandler,
} from '../controllers/do-report.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createDoReportSchema,
    bulkCreateDoReportSchema,
    updateDoReportSchema,
    getDoReportByIdSchema,
    deleteDoReportSchema,
    bulkDeleteDoReportSchema,
    getDoReportListSchema,
    getDoReportSummarySchema,
} from '../validators/do-report.validator.js'

const router = Router({ mergeParams: true })

/**
 * DO Report Routes
 * Base path: /api/mills/:millId/do-reports
 */

// Get DO report list with pagination
router.get(
    '/',
    authenticate,
    validate(getDoReportListSchema),
    getDoReportListHandler
)

// Get DO report summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getDoReportSummarySchema),
    getDoReportSummaryHandler
)

// Get DO report by ID
router.get(
    '/:id',
    authenticate,
    validate(getDoReportByIdSchema),
    getDoReportByIdHandler
)

// Create a new DO report
router.post('/', authenticate, validate(createDoReportSchema), createDoReport)

// Bulk create DO reports
router.post(
    '/bulk',
    authenticate,
    validate(bulkCreateDoReportSchema),
    bulkCreateDoReport
)

// Update a DO report
router.put(
    '/:id',
    authenticate,
    validate(updateDoReportSchema),
    updateDoReportHandler
)

// Bulk delete DO reports
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteDoReportSchema),
    bulkDeleteDoReportHandler
)

// Delete a DO report
router.delete(
    '/:id',
    authenticate,
    validate(deleteDoReportSchema),
    deleteDoReportHandler
)

export default router
