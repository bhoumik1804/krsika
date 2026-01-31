import express from 'express'
import {
    createBrokerTransaction,
    getBrokerTransactionByIdHandler,
    getBrokerTransactionListHandler,
    getBrokerTransactionSummaryHandler,
    updateBrokerTransactionHandler,
    deleteBrokerTransactionHandler,
    bulkDeleteBrokerTransactionHandler,
} from '../controllers/broker-transaction.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createBrokerTransactionSchema,
    updateBrokerTransactionSchema,
    getBrokerTransactionByIdSchema,
    deleteBrokerTransactionSchema,
    bulkDeleteBrokerTransactionSchema,
    listBrokerTransactionSchema,
    summaryBrokerTransactionSchema,
} from '../validators/broker-transaction.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Broker Transaction Routes
 * Base path: /api/mills/:millId/broker-transactions
 */

// GET /api/mills/:millId/broker-transactions/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryBrokerTransactionSchema),
    getBrokerTransactionSummaryHandler
)

// GET /api/mills/:millId/broker-transactions - Get list with pagination
router.get(
    '/',
    validate(listBrokerTransactionSchema),
    getBrokerTransactionListHandler
)

// GET /api/mills/:millId/broker-transactions/:id - Get by ID
router.get(
    '/:id',
    validate(getBrokerTransactionByIdSchema),
    getBrokerTransactionByIdHandler
)

// POST /api/mills/:millId/broker-transactions - Create new entry
router.post(
    '/',
    validate(createBrokerTransactionSchema),
    createBrokerTransaction
)

// PUT /api/mills/:millId/broker-transactions/:id - Update entry
router.put(
    '/:id',
    validate(updateBrokerTransactionSchema),
    updateBrokerTransactionHandler
)

// DELETE /api/mills/:millId/broker-transactions/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteBrokerTransactionSchema),
    bulkDeleteBrokerTransactionHandler
)

// DELETE /api/mills/:millId/broker-transactions/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteBrokerTransactionSchema),
    deleteBrokerTransactionHandler
)

export default router
