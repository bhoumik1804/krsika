import { Router } from 'express'
import {
    createLabourGroup,
    getLabourGroupByIdHandler,
    getLabourGroupListHandler,
    getLabourGroupSummaryHandler,
    updateLabourGroupHandler,
    deleteLabourGroupHandler,
    bulkDeleteLabourGroupHandler,
} from '../controllers/labour-group.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createLabourGroupSchema,
    updateLabourGroupSchema,
    getLabourGroupByIdSchema,
    deleteLabourGroupSchema,
    bulkDeleteLabourGroupSchema,
    getLabourGroupListSchema,
    getLabourGroupSummarySchema,
} from '../validators/labour-group.validator.js'

const router = Router({ mergeParams: true })

/**
 * Labour Group Routes
 * Base path: /api/mills/:millId/labour-groups
 */

// Get labour group list with pagination
router.get(
    '/',
    authenticate,
    validate(getLabourGroupListSchema),
    getLabourGroupListHandler
)

// Get labour group summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getLabourGroupSummarySchema),
    getLabourGroupSummaryHandler
)

// Get labour group by ID
router.get(
    '/:id',
    authenticate,
    validate(getLabourGroupByIdSchema),
    getLabourGroupByIdHandler
)

// Create a new labour group
router.post(
    '/',
    authenticate,
    validate(createLabourGroupSchema),
    createLabourGroup
)

// Update a labour group
router.put(
    '/:id',
    authenticate,
    validate(updateLabourGroupSchema),
    updateLabourGroupHandler
)

// Bulk delete labour groups
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteLabourGroupSchema),
    bulkDeleteLabourGroupHandler
)

// Delete a labour group
router.delete(
    '/:id',
    authenticate,
    validate(deleteLabourGroupSchema),
    deleteLabourGroupHandler
)

export default router
