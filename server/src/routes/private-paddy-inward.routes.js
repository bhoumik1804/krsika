import express from 'express'
import {
    createPrivatePaddyInward,
    getPrivatePaddyInwardByIdHandler,
    getPrivatePaddyInwardListHandler,
    getPrivatePaddyInwardSummaryHandler,
    updatePrivatePaddyInwardHandler,
    deletePrivatePaddyInwardHandler,
    bulkDeletePrivatePaddyInwardHandler,
} from '../controllers/private-paddy-inward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPrivatePaddyInwardSchema,
    updatePrivatePaddyInwardSchema,
    getPrivatePaddyInwardByIdSchema,
    deletePrivatePaddyInwardSchema,
    bulkDeletePrivatePaddyInwardSchema,
    listPrivatePaddyInwardSchema,
    summaryPrivatePaddyInwardSchema,
} from '../validators/private-paddy-inward.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Private Paddy Inward Routes
 * Base path: /api/mills/:millId/private-paddy-inward
 */

// GET /api/mills/:millId/private-paddy-inward/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryPrivatePaddyInwardSchema),
    getPrivatePaddyInwardSummaryHandler
)

// GET /api/mills/:millId/private-paddy-inward - Get list with pagination
router.get(
    '/',
    validate(listPrivatePaddyInwardSchema),
    getPrivatePaddyInwardListHandler
)

// GET /api/mills/:millId/private-paddy-inward/:id - Get by ID
router.get(
    '/:id',
    validate(getPrivatePaddyInwardByIdSchema),
    getPrivatePaddyInwardByIdHandler
)

// POST /api/mills/:millId/private-paddy-inward - Create new entry
router.post(
    '/',
    validate(createPrivatePaddyInwardSchema),
    createPrivatePaddyInward
)

// PUT /api/mills/:millId/private-paddy-inward/:id - Update entry
router.put(
    '/:id',
    validate(updatePrivatePaddyInwardSchema),
    updatePrivatePaddyInwardHandler
)

// DELETE /api/mills/:millId/private-paddy-inward/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeletePrivatePaddyInwardSchema),
    bulkDeletePrivatePaddyInwardHandler
)

// DELETE /api/mills/:millId/private-paddy-inward/:id - Delete entry
router.delete(
    '/:id',
    validate(deletePrivatePaddyInwardSchema),
    deletePrivatePaddyInwardHandler
)

export default router
