import express from 'express'
import {
    createGovtRiceOutward,
    getGovtRiceOutwardByIdHandler,
    getGovtRiceOutwardListHandler,
    getGovtRiceOutwardSummaryHandler,
    updateGovtRiceOutwardHandler,
    deleteGovtRiceOutwardHandler,
    bulkDeleteGovtRiceOutwardHandler,
} from '../controllers/govt-rice-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createGovtRiceOutwardSchema,
    updateGovtRiceOutwardSchema,
    getGovtRiceOutwardByIdSchema,
    deleteGovtRiceOutwardSchema,
    bulkDeleteGovtRiceOutwardSchema,
    listGovtRiceOutwardSchema,
    summaryGovtRiceOutwardSchema,
} from '../validators/govt-rice-outward.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Govt Rice Outward Routes
 * Base path: /api/mills/:millId/govt-rice-outward
 */

// GET /api/mills/:millId/govt-rice-outward/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryGovtRiceOutwardSchema),
    getGovtRiceOutwardSummaryHandler
)

// GET /api/mills/:millId/govt-rice-outward - Get list with pagination
router.get(
    '/',
    validate(listGovtRiceOutwardSchema),
    getGovtRiceOutwardListHandler
)

// GET /api/mills/:millId/govt-rice-outward/:id - Get by ID
router.get(
    '/:id',
    validate(getGovtRiceOutwardByIdSchema),
    getGovtRiceOutwardByIdHandler
)

// POST /api/mills/:millId/govt-rice-outward - Create new entry
router.post('/', validate(createGovtRiceOutwardSchema), createGovtRiceOutward)

// PUT /api/mills/:millId/govt-rice-outward/:id - Update entry
router.put(
    '/:id',
    validate(updateGovtRiceOutwardSchema),
    updateGovtRiceOutwardHandler
)

// DELETE /api/mills/:millId/govt-rice-outward/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteGovtRiceOutwardSchema),
    bulkDeleteGovtRiceOutwardHandler
)

// DELETE /api/mills/:millId/govt-rice-outward/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteGovtRiceOutwardSchema),
    deleteGovtRiceOutwardHandler
)

export default router
