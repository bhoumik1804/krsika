import { Router } from 'express'
import {
    createCommittee,
    bulkCreateCommittees,
    getCommitteeByIdHandler,
    getCommitteeListHandler,
    getCommitteeSummaryHandler,
    updateCommitteeHandler,
    deleteCommitteeHandler,
    bulkDeleteCommitteeHandler,
} from '../controllers/committee.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createCommitteeSchema,
    bulkCreateCommitteeSchema,
    updateCommitteeSchema,
    getCommitteeByIdSchema,
    deleteCommitteeSchema,
    bulkDeleteCommitteeSchema,
    getCommitteeListSchema,
    getCommitteeSummarySchema,
} from '../validators/committee.validator.js'

const router = Router({ mergeParams: true })

/**
 * Committee Routes
 * Base path: /api/mills/:millId/committees
 */

// Get committee list with pagination
router.get(
    '/',
    authenticate,
    validate(getCommitteeListSchema),
    getCommitteeListHandler
)

// Get committee summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getCommitteeSummarySchema),
    getCommitteeSummaryHandler
)

// Get committee by ID
router.get(
    '/:id',
    authenticate,
    validate(getCommitteeByIdSchema),
    getCommitteeByIdHandler
)

// Create a new committee
router.post('/', authenticate, validate(createCommitteeSchema), createCommittee)

// Bulk create committees
router.post('/bulk', authenticate, validate(bulkCreateCommitteeSchema), bulkCreateCommittees)

// Update a committee
router.put(
    '/:id',
    authenticate,
    validate(updateCommitteeSchema),
    updateCommitteeHandler
)

// Bulk delete committees
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteCommitteeSchema),
    bulkDeleteCommitteeHandler
)

// Delete a committee
router.delete(
    '/:id',
    authenticate,
    validate(deleteCommitteeSchema),
    deleteCommitteeHandler
)

export default router
