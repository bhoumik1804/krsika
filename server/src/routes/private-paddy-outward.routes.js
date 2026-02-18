import { Router } from 'express'
import {
    createPrivatePaddyOutward,
    getPrivatePaddyOutwardByIdHandler,
    getPrivatePaddyOutwardListHandler,
    getPrivatePaddyOutwardSummaryHandler,
    updatePrivatePaddyOutwardHandler,
    deletePrivatePaddyOutwardHandler,
    bulkDeletePrivatePaddyOutwardHandler,
} from '../controllers/private-paddy-outward.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPrivatePaddyOutwardSchema,
    updatePrivatePaddyOutwardSchema,
    getPrivatePaddyOutwardByIdSchema,
    deletePrivatePaddyOutwardSchema,
    bulkDeletePrivatePaddyOutwardSchema,
    getPrivatePaddyOutwardListSchema,
    getPrivatePaddyOutwardSummarySchema,
} from '../validators/private-paddy-outward.validator.js'

const router = Router({ mergeParams: true })

router.use(authenticate)

/**
 * Private Paddy Outward Routes
 * Base path: /api/mills/:millId/private-paddy-outward
 */

// GET /api/mills/:millId/private-paddy-outward/summary - Get summary statistics
router.get(
    '/summary',
    validate(getPrivatePaddyOutwardSummarySchema),
    getPrivatePaddyOutwardSummaryHandler
)

// GET /api/mills/:millId/private-paddy-outward - Get list with pagination
router.get(
    '/',
    validate(getPrivatePaddyOutwardListSchema),
    getPrivatePaddyOutwardListHandler
)

// GET /api/mills/:millId/private-paddy-outward/:id - Get by ID
router.get(
    '/:id',
    validate(getPrivatePaddyOutwardByIdSchema),
    getPrivatePaddyOutwardByIdHandler
)

// POST /api/mills/:millId/private-paddy-outward - Create new entry
router.post(
    '/',
    validate(createPrivatePaddyOutwardSchema),
    createPrivatePaddyOutward
)

// PUT /api/mills/:millId/private-paddy-outward/:id - Update entry
router.put(
    '/:id',
    validate(updatePrivatePaddyOutwardSchema),
    updatePrivatePaddyOutwardHandler
)

// DELETE /api/mills/:millId/private-paddy-outward/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeletePrivatePaddyOutwardSchema),
    bulkDeletePrivatePaddyOutwardHandler
)

// DELETE /api/mills/:millId/private-paddy-outward/:id - Delete entry
router.delete(
    '/:id',
    validate(deletePrivatePaddyOutwardSchema),
    deletePrivatePaddyOutwardHandler
)

export default router
