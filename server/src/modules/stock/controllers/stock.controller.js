/**
 * Stock Controller
 * ================
 * HTTP request handlers for stock operations
 */
import ApiError from '../../../shared/utils/api-error.js'
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import stockService from '../services/stock.service.js'

const stockController = {
    /**
     * Get all stocks for a mill
     * GET /api/v1/mills/:millId/stocks
     */
    getAll: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const filters = {
            millId,
            page: req.query?.page,
            limit: req.query?.limit,
            stockType: req.query?.stockType,
            sortBy: req.query?.sortBy,
            sortOrder: req.query?.sortOrder,
            lowStock: req.query?.lowStock,
        }

        const stocks = await stockService.findAll(filters)

        res.json(ApiResponse.paginated(stocks, 'Stocks retrieved successfully'))
    }),

    /**
     * Get stock by ID
     * GET /api/v1/mills/:millId/stocks/:stockId
     */
    getById: asyncHandler(async (req, res) => {
        const { millId, stockId } = req.params

        const stock = await stockService.findById(stockId, millId)

        if (!stock) {
            throw ApiError.notFound('Stock not found')
        }

        res.json(ApiResponse.success(stock, 'Stock retrieved successfully'))
    }),

    /**
     * Get stock summary
     * GET /api/v1/mills/:millId/stocks/summary
     */
    getSummary: asyncHandler(async (req, res) => {
        const { millId } = req.params

        const summary = await stockService.getStockSummary(millId)

        res.json(
            ApiResponse.success(
                summary[0] || {
                    totalStockTypes: 0,
                    totalCurrentQuantity: 0,
                    totalPurchased: 0,
                    totalSold: 0,
                    stocks: [],
                    lowStockCount: 0,
                },
                'Stock summary retrieved successfully'
            )
        )
    }),

    /**
     * Get low stock alerts
     * GET /api/v1/mills/:millId/stocks/alerts
     */
    getLowStockAlerts: asyncHandler(async (req, res) => {
        const { millId } = req.params

        const alerts = await stockService.getLowStockAlerts(millId)

        res.json(
            ApiResponse.success(
                alerts,
                'Low stock alerts retrieved successfully'
            )
        )
    }),

    /**
     * Initialize stock
     * POST /api/v1/mills/:millId/stocks
     */
    initialize: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const { stockType, lowStockThreshold } = req.body

        const stock = await stockService.initializeStock({
            millId,
            stockType,
            lowStockThreshold,
        })

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('stock:initialized', stock)
        }

        res.status(201).json(
            ApiResponse.created(stock, 'Stock initialized successfully')
        )
    }),

    /**
     * Initialize all stock types
     * POST /api/v1/mills/:millId/stocks/initialize-all
     */
    initializeAll: asyncHandler(async (req, res) => {
        const { millId } = req.params

        const stocks = await stockService.initializeAllStocks(millId)

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('stock:allInitialized', stocks)
        }

        res.status(201).json(
            ApiResponse.created(stocks, 'All stocks initialized successfully')
        )
    }),

    /**
     * Update stock threshold
     * PATCH /api/v1/mills/:millId/stocks/:stockId/threshold
     */
    updateThreshold: asyncHandler(async (req, res) => {
        const { millId, stockId } = req.params
        const { lowStockThreshold } = req.body

        const stock = await stockService.updateThreshold(
            stockId,
            millId,
            lowStockThreshold
        )

        if (!stock) {
            throw ApiError.notFound('Stock not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('stock:thresholdUpdated', stock)
        }

        res.json(
            ApiResponse.success(stock, 'Stock threshold updated successfully')
        )
    }),

    /**
     * Stock transfer (e.g., PADDY to RICE)
     * POST /api/v1/mills/:millId/stocks/transfer
     */
    transfer: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const { fromStockType, toStockType, fromQuantity, toQuantity, note } =
            req.body

        const result = await stockService.transferStock({
            millId,
            fromStockType,
            toStockType,
            fromQuantity,
            toQuantity,
            note,
        })

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('stock:transferred', result)
        }

        res.json(
            ApiResponse.success(result, 'Stock transfer completed successfully')
        )
    }),

    /**
     * Adjust stock manually
     * POST /api/v1/mills/:millId/stocks/:stockId/adjust
     */
    adjust: asyncHandler(async (req, res) => {
        const { millId, stockId } = req.params
        const { adjustmentQuantity, reason } = req.body

        const stock = await stockService.adjustStock({
            stockId,
            millId,
            adjustmentQuantity,
            reason,
        })

        if (!stock) {
            throw ApiError.notFound('Stock not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('stock:adjusted', stock)
        }

        res.json(ApiResponse.success(stock, 'Stock adjusted successfully'))
    }),

    /**
     * Check stock availability
     * GET /api/v1/mills/:millId/stocks/availability
     */
    checkAvailability: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const { stockType, quantity } = req.query

        const availability = await stockService.checkAvailability(
            millId,
            stockType,
            parseFloat(quantity)
        )

        res.json(
            ApiResponse.success(
                availability,
                'Availability checked successfully'
            )
        )
    }),
}

export default stockController
