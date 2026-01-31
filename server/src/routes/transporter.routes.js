import { Router } from 'express'
import {
    createTransporter,
    getTransporterByIdHandler,
    getTransporterListHandler,
    getTransporterSummaryHandler,
    updateTransporterHandler,
    deleteTransporterHandler,
    bulkDeleteTransporterHandler,
} from '../controllers/transporter.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createTransporterSchema,
    updateTransporterSchema,
    getTransporterByIdSchema,
    deleteTransporterSchema,
    bulkDeleteTransporterSchema,
    getTransporterListSchema,
    getTransporterSummarySchema,
} from '../validators/transporter.validator.js'

const router = Router({ mergeParams: true })

/**
 * Transporter Routes
 * Base path: /api/mills/:millId/transporters
 */

// Get transporter list with pagination
router.get(
    '/',
    authenticate,
    validate(getTransporterListSchema),
    getTransporterListHandler
)

// Get transporter summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getTransporterSummarySchema),
    getTransporterSummaryHandler
)

// Get transporter by ID
router.get(
    '/:id',
    authenticate,
    validate(getTransporterByIdSchema),
    getTransporterByIdHandler
)

// Create a new transporter
router.post(
    '/',
    authenticate,
    validate(createTransporterSchema),
    createTransporter
)

// Update a transporter
router.put(
    '/:id',
    authenticate,
    validate(updateTransporterSchema),
    updateTransporterHandler
)

// Bulk delete transporters
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteTransporterSchema),
    bulkDeleteTransporterHandler
)

// Delete a transporter
router.delete(
    '/:id',
    authenticate,
    validate(deleteTransporterSchema),
    deleteTransporterHandler
)

export default router
