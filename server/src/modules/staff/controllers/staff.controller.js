/**
 * Staff Controller
 * ================
 * HTTP request handlers for staff operations
 */
import ApiError from '../../../shared/utils/api-error.js'
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import staffService from '../services/staff.service.js'

const staffController = {
    /**
     * Get all staff
     * GET /api/v1/mills/:millId/staff
     */
    getAll: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const filters = {
            millId,
            page: req.query?.page,
            limit: req.query?.limit,
            search: req.query?.search,
            role: req.query?.role,
            isActive: req.query?.isActive,
            sortBy: req.query?.sortBy,
            sortOrder: req.query?.sortOrder,
        }

        const staff = await staffService.findAll(filters)

        res.json(ApiResponse.paginated(staff, 'Staff retrieved successfully'))
    }),

    /**
     * Get staff by ID
     * GET /api/v1/mills/:millId/staff/:staffId
     */
    getById: asyncHandler(async (req, res) => {
        const { millId, staffId } = req.params

        const staff = await staffService.findById(staffId, millId)

        if (!staff) {
            throw ApiError.notFound('Staff not found')
        }

        res.json(ApiResponse.success(staff, 'Staff retrieved successfully'))
    }),

    /**
     * Create new staff
     * POST /api/v1/mills/:millId/staff
     */
    create: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const staffData = { ...req.body, millId }

        try {
            const staff = await staffService.create(staffData)

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('staff:created', staff)
            }

            res.status(201).json(
                ApiResponse.created(staff, 'Staff created successfully')
            )
        } catch (error) {
            if (error.message.includes('already registered')) {
                throw ApiError.conflict(error.message)
            }
            if (error.message.includes('Invalid role')) {
                throw ApiError.badRequest(error.message)
            }
            throw error
        }
    }),

    /**
     * Update staff
     * PUT /api/v1/mills/:millId/staff/:staffId
     */
    update: asyncHandler(async (req, res) => {
        const { millId, staffId } = req.params
        const updateData = req.body

        try {
            const staff = await staffService.update(staffId, millId, updateData)

            if (!staff) {
                throw ApiError.notFound('Staff not found')
            }

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('staff:updated', staff)
            }

            res.json(ApiResponse.success(staff, 'Staff updated successfully'))
        } catch (error) {
            if (error.message.includes('already registered')) {
                throw ApiError.conflict(error.message)
            }
            if (error.message.includes('Invalid role')) {
                throw ApiError.badRequest(error.message)
            }
            throw error
        }
    }),

    /**
     * Delete staff
     * DELETE /api/v1/mills/:millId/staff/:staffId
     */
    delete: asyncHandler(async (req, res) => {
        const { millId, staffId } = req.params

        try {
            const staff = await staffService.delete(staffId, millId)

            if (!staff) {
                throw ApiError.notFound('Staff not found')
            }

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('staff:deleted', { id: staffId })
            }

            res.json(ApiResponse.success(null, 'Staff deleted successfully'))
        } catch (error) {
            if (error.message.includes('Cannot delete')) {
                throw ApiError.badRequest(error.message)
            }
            throw error
        }
    }),

    /**
     * Toggle staff status
     * PATCH /api/v1/mills/:millId/staff/:staffId/toggle-status
     */
    toggleStatus: asyncHandler(async (req, res) => {
        const { millId, staffId } = req.params

        try {
            const staff = await staffService.toggleStatus(staffId, millId)

            if (!staff) {
                throw ApiError.notFound('Staff not found')
            }

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('staff:statusToggled', staff)
            }

            res.json(
                ApiResponse.success(
                    staff,
                    `Staff ${staff.isActive ? 'activated' : 'deactivated'} successfully`
                )
            )
        } catch (error) {
            if (error.message.includes('Cannot deactivate')) {
                throw ApiError.badRequest(error.message)
            }
            throw error
        }
    }),

    /**
     * Reset staff password
     * POST /api/v1/mills/:millId/staff/:staffId/reset-password
     */
    resetPassword: asyncHandler(async (req, res) => {
        const { millId, staffId } = req.params
        const { newPassword } = req.body

        const result = await staffService.resetPassword(
            staffId,
            millId,
            newPassword
        )

        if (!result) {
            throw ApiError.notFound('Staff not found')
        }

        res.json(ApiResponse.success(null, 'Password reset successfully'))
    }),

    /**
     * Update staff permissions
     * PUT /api/v1/mills/:millId/staff/:staffId/permissions
     */
    updatePermissions: asyncHandler(async (req, res) => {
        const { millId, staffId } = req.params
        const { permissions } = req.body

        const staff = await staffService.updatePermissions(
            staffId,
            millId,
            permissions
        )

        if (!staff) {
            throw ApiError.notFound('Staff not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('staff:permissionsUpdated', staff)
        }

        res.json(ApiResponse.success(staff, 'Permissions updated successfully'))
    }),

    /**
     * Get staff summary
     * GET /api/v1/mills/:millId/staff/summary
     */
    getSummary: asyncHandler(async (req, res) => {
        const { millId } = req.params

        const summary = await staffService.getSummary(millId)

        res.json(
            ApiResponse.success(
                summary[0] || {
                    totalStaff: 0,
                    totalActive: 0,
                    totalInactive: 0,
                    byRole: [],
                },
                'Staff summary retrieved successfully'
            )
        )
    }),
}

export default staffController
