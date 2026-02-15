import express from 'express'
import {
    getStockTransactionByIdHandler,
    getStockTransactionListHandler,
    getStockBalanceHandler,
    getStockTransactionSummaryHandler,
    getStockByActionHandler,
} from '../controllers/stock-transaction.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    getStockTransactionByIdSchema,
    getStockTransactionListSchema,
    getStockTransactionSummarySchema,
} from '../validators/stock-transaction.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Stock Transaction Routes
 * Base path: /api/mills/:millId/stock-transactions
 */

// GET /api/mills/:millId/stock-transactions/by-action - Get stock grouped by commodity for a specific action
router.get('/by-action', getStockByActionHandler)

// GET /api/mills/:millId/stock-transactions/balance - Get stock balance
router.get('/balance', getStockBalanceHandler)

// GET /api/mills/:millId/stock-transactions/summary - Get summary statistics
router.get(
    '/summary',
    validate(getStockTransactionSummarySchema),
    getStockTransactionSummaryHandler
)

// GET /api/mills/:millId/stock-transactions - Get list with pagination
router.get(
    '/',
    validate(getStockTransactionListSchema),
    getStockTransactionListHandler
)

// GET /api/mills/:millId/stock-transactions/:id - Get by ID
router.get(
    '/:id',
    validate(getStockTransactionByIdSchema),
    getStockTransactionByIdHandler
)

export default router
