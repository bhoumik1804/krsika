import express from 'express'
import {
    createPartyTransaction,
    getPartyTransactionByIdHandler,
    getPartyTransactionListHandler,
    getPartyTransactionSummaryHandler,
    updatePartyTransactionHandler,
    deletePartyTransactionHandler,
    bulkDeletePartyTransactionHandler,
} from '../controllers/party-transaction.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createPartyTransactionSchema,
    updatePartyTransactionSchema,
    getPartyTransactionByIdSchema,
    deletePartyTransactionSchema,
    bulkDeletePartyTransactionSchema,
    listPartyTransactionSchema,
    summaryPartyTransactionSchema,
} from '../validators/party-transaction.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Party Transaction Routes
 * Base path: /api/mills/:millId/party-transactions
 */

// GET /api/mills/:millId/party-transactions/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryPartyTransactionSchema),
    getPartyTransactionSummaryHandler
)

// GET /api/mills/:millId/party-transactions - Get list with pagination
router.get(
    '/',
    validate(listPartyTransactionSchema),
    getPartyTransactionListHandler
)

// GET /api/mills/:millId/party-transactions/:id - Get by ID
router.get(
    '/:id',
    validate(getPartyTransactionByIdSchema),
    getPartyTransactionByIdHandler
)

// POST /api/mills/:millId/party-transactions - Create new entry
router.post('/', validate(createPartyTransactionSchema), createPartyTransaction)

// PUT /api/mills/:millId/party-transactions/:id - Update entry
router.put(
    '/:id',
    validate(updatePartyTransactionSchema),
    updatePartyTransactionHandler
)

// DELETE /api/mills/:millId/party-transactions/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeletePartyTransactionSchema),
    bulkDeletePartyTransactionHandler
)

// DELETE /api/mills/:millId/party-transactions/:id - Delete entry
router.delete(
    '/:id',
    validate(deletePartyTransactionSchema),
    deletePartyTransactionHandler
)

export default router
