import { Router } from 'express'
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

const router = Router({ mergeParams: true })

/**
 * Govt Rice Outward Routes
 * Base path: /api/mills/:millId/govt-rice-outward
 */

// Get govt rice outward summary (must be before /:id route)
router.get(
    '/summary',
    authenticate,
    validate(summaryGovtRiceOutwardSchema),
    getGovtRiceOutwardSummaryHandler
)

// Bulk delete govt rice outward entries (must be before /:id route)
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteGovtRiceOutwardSchema),
    bulkDeleteGovtRiceOutwardHandler
)

// Get govt rice outward list with pagination
router.get(
    '/',
    authenticate,
    validate(listGovtRiceOutwardSchema),
    getGovtRiceOutwardListHandler
)

// Create a new govt rice outward entry
router.post(
    '/',
    authenticate,
    validate(createGovtRiceOutwardSchema),
    createGovtRiceOutward
)

// Get govt rice outward entry by ID
router.get(
    '/:id',
    authenticate,
    validate(getGovtRiceOutwardByIdSchema),
    getGovtRiceOutwardByIdHandler
)

// Update a govt rice outward entry
router.put(
    '/:id',
    authenticate,
    validate(updateGovtRiceOutwardSchema),
    updateGovtRiceOutwardHandler
)

// Delete a govt rice outward entry
router.delete(
    '/:id',
    authenticate,
    validate(deleteGovtRiceOutwardSchema),
    deleteGovtRiceOutwardHandler
)

export default router
