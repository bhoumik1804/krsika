import express from 'express'
import {
    createGovtPaddyInward,
    getGovtPaddyInwardByIdHandler,
    getGovtPaddyInwardListHandler,
    getGovtPaddyInwardSummaryHandler,
    updateGovtPaddyInwardHandler,
    deleteGovtPaddyInwardHandler,
    bulkDeleteGovtPaddyInwardHandler,
} from '../controllers/govt-paddy-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createGovtPaddyInwardSchema,
    updateGovtPaddyInwardSchema,
    getGovtPaddyInwardByIdSchema,
    deleteGovtPaddyInwardSchema,
    bulkDeleteGovtPaddyInwardSchema,
    listGovtPaddyInwardSchema,
    summaryGovtPaddyInwardSchema,
} from '../validators/govt-paddy-inward.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Govt Paddy Inward Routes
 * Base path: /api/mills/:millId/govt-paddy-inward
 */

// GET /api/mills/:millId/govt-paddy-inward/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryGovtPaddyInwardSchema),
    getGovtPaddyInwardSummaryHandler
)

// GET /api/mills/:millId/govt-paddy-inward - Get list with pagination
router.get(
    '/',
    validate(listGovtPaddyInwardSchema),
    getGovtPaddyInwardListHandler
)

// GET /api/mills/:millId/govt-paddy-inward/:id - Get by ID
router.get(
    '/:id',
    validate(getGovtPaddyInwardByIdSchema),
    getGovtPaddyInwardByIdHandler
)

// POST /api/mills/:millId/govt-paddy-inward - Create new entry
router.post('/', validate(createGovtPaddyInwardSchema), createGovtPaddyInward)

// PUT /api/mills/:millId/govt-paddy-inward/:id - Update entry
router.put(
    '/:id',
    validate(updateGovtPaddyInwardSchema),
    updateGovtPaddyInwardHandler
)

// DELETE /api/mills/:millId/govt-paddy-inward/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteGovtPaddyInwardSchema),
    bulkDeleteGovtPaddyInwardHandler
)

// DELETE /api/mills/:millId/govt-paddy-inward/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteGovtPaddyInwardSchema),
    deleteGovtPaddyInwardHandler
)

export default router
