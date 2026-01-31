import { Router } from 'express'
import {
    createBroker,
    getBrokerByIdHandler,
    getBrokerListHandler,
    getBrokerSummaryHandler,
    updateBrokerHandler,
    deleteBrokerHandler,
    bulkDeleteBrokerHandler,
} from '../controllers/broker.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createBrokerSchema,
    updateBrokerSchema,
    getBrokerByIdSchema,
    deleteBrokerSchema,
    bulkDeleteBrokerSchema,
    getBrokerListSchema,
    getBrokerSummarySchema,
} from '../validators/broker.validator.js'

const router = Router({ mergeParams: true })

/**
 * Broker Routes
 * Base path: /api/mills/:millId/brokers
 */

// Get broker list with pagination
router.get(
    '/',
    authenticate,
    validate(getBrokerListSchema),
    getBrokerListHandler
)

// Get broker summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getBrokerSummarySchema),
    getBrokerSummaryHandler
)

// Get broker by ID
router.get(
    '/:id',
    authenticate,
    validate(getBrokerByIdSchema),
    getBrokerByIdHandler
)

// Create a new broker
router.post('/', authenticate, validate(createBrokerSchema), createBroker)

// Update a broker
router.put(
    '/:id',
    authenticate,
    validate(updateBrokerSchema),
    updateBrokerHandler
)

// Bulk delete brokers
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteBrokerSchema),
    bulkDeleteBrokerHandler
)

// Delete a broker
router.delete(
    '/:id',
    authenticate,
    validate(deleteBrokerSchema),
    deleteBrokerHandler
)

export default router
