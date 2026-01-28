/**
 * Mill Controller
 * ================
 * HTTP request handlers for mill operations
 */
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import millService from '../services/mill.service.js'

class MillController {
    /**
     * Get all mills (Super Admin only)
     * GET /api/v1/admin/mills
     */
    getAll = asyncHandler(async (req, res) => {
        const result = await millService.findAll(req.query)
        res.json(
            ApiResponse.paginated(
                result.data,
                result.pagination,
                'Mills retrieved successfully'
            )
        )
    })

    /**
     * Get mill by ID
     * GET /api/v1/mills/:millId
     */
    getById = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const mill = await millService.findById(millId)
        res.json(ApiResponse.success(mill, 'Mill retrieved successfully'))
    })

    /**
     * Get mill by code
     * GET /api/v1/mills/code/:code
     */
    getByCode = asyncHandler(async (req, res) => {
        const { code } = req.params
        const mill = await millService.findByCode(code)
        res.json(ApiResponse.success(mill, 'Mill retrieved successfully'))
    })

    /**
     * Create a new mill
     * POST /api/v1/admin/mills
     */
    create = asyncHandler(async (req, res) => {
        const mill = await millService.create(req.body, req.user._id)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to('admin').emit('mill:created', mill)
        }

        res.status(201).json(
            ApiResponse.created(mill, 'Mill created successfully')
        )
    })

    /**
     * Update mill
     * PUT /api/v1/mills/:millId
     */
    update = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const mill = await millService.update(millId, req.body)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('mill:updated', mill)
        }

        res.json(ApiResponse.success(mill, 'Mill updated successfully'))
    })

    /**
     * Update mill status
     * PATCH /api/v1/admin/mills/:millId/status
     */
    updateStatus = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const { status } = req.body
        const mill = await millService.updateStatus(millId, status)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to('admin').emit('mill:statusChanged', { millId, status })
            io.to(`mill:${millId}`).emit('mill:statusChanged', { status })
        }

        res.json(ApiResponse.success(mill, 'Mill status updated successfully'))
    })

    /**
     * Delete mill
     * DELETE /api/v1/admin/mills/:millId
     */
    delete = asyncHandler(async (req, res) => {
        const { millId } = req.params
        await millService.delete(millId)

        // Emit socket event if available
        const io = req.app.get('io')
        if (io) {
            io.to('admin').emit('mill:deleted', { millId })
        }

        res.json(ApiResponse.success(null, 'Mill deleted successfully'))
    })

    /**
     * Get mill statistics
     * GET /api/v1/mills/:millId/stats
     */
    getStats = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const stats = await millService.getStats(millId)
        res.json(
            ApiResponse.success(stats, 'Mill statistics retrieved successfully')
        )
    })

    /**
     * Get current user's mill
     * GET /api/v1/mills/my-mill
     */
    getMyMill = asyncHandler(async (req, res) => {
        const millId = req.user.millId
        if (!millId) {
            return res.json(
                ApiResponse.success(
                    null,
                    'User is not associated with any mill'
                )
            )
        }
        const mill = await millService.findById(millId)
        res.json(ApiResponse.success(mill, 'Mill retrieved successfully'))
    })

    /**
     * Update mill settings
     * PUT /api/v1/mills/:millId/settings
     */
    updateSettings = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const mill = await millService.updateSettings(millId, req.body)
        res.json(
            ApiResponse.success(
                mill.settings,
                'Mill settings updated successfully'
            )
        )
    })

    /**
     * Get mill settings
     * GET /api/v1/mills/:millId/settings
     */
    getSettings = asyncHandler(async (req, res) => {
        const { millId } = req.params
        const settings = await millService.getSettings(millId)
        res.json(
            ApiResponse.success(
                settings,
                'Mill settings retrieved successfully'
            )
        )
    })
}

export default new MillController()
