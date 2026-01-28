/**
 * Purchase Controller
 * ====================
 * HTTP request handlers for purchase operations
 */
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import purchaseService from '../services/purchase.service.js'

class PurchaseController {
    /**
     * Get all purchases for a mill
     * GET /api/v1/mills/:millId/purchases
     */
    getAll = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const result = await purchaseService.findAll(millId, req.query)
        res.json(
            ApiResponse.paginated(
                result.data,
                result.pagination,
                'Purchases retrieved successfully'
            )
        )
    })

    /**
     * Get purchase by ID
     * GET /api/v1/mills/:millId/purchases/:purchaseId
     */
    getById = asyncHandler(async (req, res) => {
        const { millId, purchaseId } = req.params
        const purchase = await purchaseService.findById(millId, purchaseId)
        res.json(
            ApiResponse.success(purchase, 'Purchase retrieved successfully')
        )
    })

    /**
     * Create a new purchase
     * POST /api/v1/mills/:millId/purchases
     */
    create = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const purchase = await purchaseService.create(
            millId,
            req.body,
            req.user._id
        )

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('purchase:created', purchase)
        }

        res.status(201).json(
            ApiResponse.created(purchase, 'Purchase created successfully')
        )
    })

    /**
     * Update purchase
     * PUT /api/v1/mills/:millId/purchases/:purchaseId
     */
    update = asyncHandler(async (req, res) => {
        const { millId, purchaseId } = req.params
        const purchase = await purchaseService.update(
            millId,
            purchaseId,
            req.body
        )

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('purchase:updated', purchase)
        }

        res.json(ApiResponse.success(purchase, 'Purchase updated successfully'))
    })

    /**
     * Delete purchase
     * DELETE /api/v1/mills/:millId/purchases/:purchaseId
     */
    delete = asyncHandler(async (req, res) => {
        const { millId, purchaseId } = req.params
        await purchaseService.delete(millId, purchaseId)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('purchase:deleted', { purchaseId })
        }

        res.json(ApiResponse.success(null, 'Purchase deleted successfully'))
    })

    /**
     * Record payment for purchase
     * POST /api/v1/mills/:millId/purchases/:purchaseId/payment
     */
    recordPayment = asyncHandler(async (req, res) => {
        const { millId, purchaseId } = req.params
        const purchase = await purchaseService.recordPayment(
            millId,
            purchaseId,
            req.body
        )

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('purchase:paymentRecorded', purchase)
        }

        res.json(ApiResponse.success(purchase, 'Payment recorded successfully'))
    })

    /**
     * Get purchase summary/stats
     * GET /api/v1/mills/:millId/purchases/summary
     */
    getSummary = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const summary = await purchaseService.getSummary(millId, req.query)
        res.json(
            ApiResponse.success(
                summary,
                'Purchase summary retrieved successfully'
            )
        )
    })
}

export default new PurchaseController()
