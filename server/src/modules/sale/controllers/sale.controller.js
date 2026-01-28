/**
 * Sale Controller
 * ================
 * HTTP request handlers for sale operations
 */
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import saleService from '../services/sale.service.js'

class SaleController {
    /**
     * Get all sales for a mill
     * GET /api/v1/mills/:millId/sales
     */
    getAll = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const result = await saleService.findAll(millId, req.query)
        res.json(
            ApiResponse.paginated(
                result.data,
                result.pagination,
                'Sales retrieved successfully'
            )
        )
    })

    /**
     * Get sale by ID
     * GET /api/v1/mills/:millId/sales/:saleId
     */
    getById = asyncHandler(async (req, res) => {
        const { millId, saleId } = req.params
        const sale = await saleService.findById(millId, saleId)
        res.json(ApiResponse.success(sale, 'Sale retrieved successfully'))
    })

    /**
     * Create a new sale
     * POST /api/v1/mills/:millId/sales
     */
    create = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const sale = await saleService.create(millId, req.body, req.user._id)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('sale:created', sale)
        }

        res.status(201).json(
            ApiResponse.created(sale, 'Sale created successfully')
        )
    })

    /**
     * Update sale
     * PUT /api/v1/mills/:millId/sales/:saleId
     */
    update = asyncHandler(async (req, res) => {
        const { millId, saleId } = req.params
        const sale = await saleService.update(millId, saleId, req.body)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('sale:updated', sale)
        }

        res.json(ApiResponse.success(sale, 'Sale updated successfully'))
    })

    /**
     * Delete sale
     * DELETE /api/v1/mills/:millId/sales/:saleId
     */
    delete = asyncHandler(async (req, res) => {
        const { millId, saleId } = req.params
        await saleService.delete(millId, saleId)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('sale:deleted', { saleId })
        }

        res.json(ApiResponse.success(null, 'Sale deleted successfully'))
    })

    /**
     * Record payment for sale
     * POST /api/v1/mills/:millId/sales/:saleId/payment
     */
    recordPayment = asyncHandler(async (req, res) => {
        const { millId, saleId } = req.params
        const sale = await saleService.recordPayment(millId, saleId, req.body)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('sale:paymentRecorded', sale)
        }

        res.json(ApiResponse.success(sale, 'Payment recorded successfully'))
    })

    /**
     * Get sale summary/stats
     * GET /api/v1/mills/:millId/sales/summary
     */
    getSummary = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const summary = await saleService.getSummary(millId, req.query)
        res.json(
            ApiResponse.success(summary, 'Sale summary retrieved successfully')
        )
    })
}

export default new SaleController()
