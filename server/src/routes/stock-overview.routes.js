import express from 'express'
import {
    createStockOverview,
    getStockOverviewByIdHandler,
    getStockOverviewListHandler,
    getStockOverviewSummaryHandler,
    updateStockOverviewHandler,
    deleteStockOverviewHandler,
    bulkDeleteStockOverviewHandler,
} from '../controllers/stock-overview.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createStockOverviewSchema,
    updateStockOverviewSchema,
    getStockOverviewByIdSchema,
    deleteStockOverviewSchema,
    bulkDeleteStockOverviewSchema,
    listStockOverviewSchema,
    summaryStockOverviewSchema,
} from '../validators/stock-overview.validator.js'

const router = express.Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

/**
 * Stock Overview Routes
 * Base path: /api/mills/:millId/stock-overview
 */

// GET /api/mills/:millId/stock-overview/summary - Get summary statistics
router.get(
    '/summary',
    validate(summaryStockOverviewSchema),
    getStockOverviewSummaryHandler
)

// GET /api/mills/:millId/stock-overview - Get list with pagination
router.get('/', validate(listStockOverviewSchema), getStockOverviewListHandler)

// GET /api/mills/:millId/stock-overview/:id - Get by ID
router.get(
    '/:id',
    validate(getStockOverviewByIdSchema),
    getStockOverviewByIdHandler
)

// POST /api/mills/:millId/stock-overview - Create new entry
router.post('/', validate(createStockOverviewSchema), createStockOverview)

// PUT /api/mills/:millId/stock-overview/:id - Update entry
router.put(
    '/:id',
    validate(updateStockOverviewSchema),
    updateStockOverviewHandler
)

// DELETE /api/mills/:millId/stock-overview/bulk - Bulk delete entries
router.delete(
    '/bulk',
    validate(bulkDeleteStockOverviewSchema),
    bulkDeleteStockOverviewHandler
)

// DELETE /api/mills/:millId/stock-overview/:id - Delete entry
router.delete(
    '/:id',
    validate(deleteStockOverviewSchema),
    deleteStockOverviewHandler
)

export default router
