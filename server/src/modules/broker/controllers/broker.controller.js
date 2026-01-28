/**
 * Broker Controller
 * =================
 * HTTP request handlers for broker operations
 */
import ApiError from '../../../shared/utils/api-error.js'
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import brokerService from '../services/broker.service.js'

const brokerController = {
    /**
     * Get all brokers
     * GET /api/v1/mills/:millId/brokers
     */
    getAll: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const filters = {
            millId,
            page: req.query?.page,
            limit: req.query?.limit,
            search: req.query?.search,
            isActive: req.query?.isActive,
            sortBy: req.query?.sortBy,
            sortOrder: req.query?.sortOrder,
        }

        const brokers = await brokerService.findAll(filters)

        res.json(
            ApiResponse.paginated(brokers, 'Brokers retrieved successfully')
        )
    }),

    /**
     * Get broker by ID
     * GET /api/v1/mills/:millId/brokers/:brokerId
     */
    getById: asyncHandler(async (req, res) => {
        const { millId, brokerId } = req.params

        const broker = await brokerService.findById(brokerId, millId)

        if (!broker) {
            throw ApiError.notFound('Broker not found')
        }

        res.json(ApiResponse.success(broker, 'Broker retrieved successfully'))
    }),

    /**
     * Create new broker
     * POST /api/v1/mills/:millId/brokers
     */
    create: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const brokerData = { ...req.body, millId }

        try {
            const broker = await brokerService.create(brokerData)

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('broker:created', broker)
            }

            res.status(201).json(
                ApiResponse.created(broker, 'Broker created successfully')
            )
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw ApiError.conflict(error.message)
            }
            throw error
        }
    }),

    /**
     * Update broker
     * PUT /api/v1/mills/:millId/brokers/:brokerId
     */
    update: asyncHandler(async (req, res) => {
        const { millId, brokerId } = req.params
        const updateData = req.body

        try {
            const broker = await brokerService.update(
                brokerId,
                millId,
                updateData
            )

            if (!broker) {
                throw ApiError.notFound('Broker not found')
            }

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('broker:updated', broker)
            }

            res.json(ApiResponse.success(broker, 'Broker updated successfully'))
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw ApiError.conflict(error.message)
            }
            throw error
        }
    }),

    /**
     * Delete broker
     * DELETE /api/v1/mills/:millId/brokers/:brokerId
     */
    delete: asyncHandler(async (req, res) => {
        const { millId, brokerId } = req.params

        const result = await brokerService.delete(brokerId, millId)

        if (!result) {
            throw ApiError.notFound('Broker not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            if (result.isActive === false) {
                io.to(`mill:${millId}`).emit('broker:deactivated', {
                    id: brokerId,
                })
            } else {
                io.to(`mill:${millId}`).emit('broker:deleted', { id: brokerId })
            }
        }

        res.json(
            ApiResponse.success(
                null,
                result.isActive === false
                    ? 'Broker deactivated (has transactions)'
                    : 'Broker deleted successfully'
            )
        )
    }),

    /**
     * Toggle broker status
     * PATCH /api/v1/mills/:millId/brokers/:brokerId/toggle-status
     */
    toggleStatus: asyncHandler(async (req, res) => {
        const { millId, brokerId } = req.params

        const broker = await brokerService.toggleStatus(brokerId, millId)

        if (!broker) {
            throw ApiError.notFound('Broker not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('broker:statusToggled', broker)
        }

        res.json(
            ApiResponse.success(
                broker,
                `Broker ${broker.isActive ? 'activated' : 'deactivated'} successfully`
            )
        )
    }),

    /**
     * Record payment to broker
     * POST /api/v1/mills/:millId/brokers/:brokerId/payment
     */
    recordPayment: asyncHandler(async (req, res) => {
        const { millId, brokerId } = req.params
        const paymentData = req.body

        const broker = await brokerService.recordPayment(
            brokerId,
            millId,
            paymentData
        )

        if (!broker) {
            throw ApiError.notFound('Broker not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('broker:paymentRecorded', broker)
        }

        res.json(ApiResponse.success(broker, 'Payment recorded successfully'))
    }),

    /**
     * Get commission summary
     * GET /api/v1/mills/:millId/brokers/commission-summary
     */
    getCommissionSummary: asyncHandler(async (req, res) => {
        const { millId } = req.params

        const summary = await brokerService.getCommissionSummary(millId)

        res.json(
            ApiResponse.success(
                summary[0] || {
                    totalBrokers: 0,
                    totalCommissionEarned: 0,
                    totalCurrentBalance: 0,
                    brokers: [],
                },
                'Commission summary retrieved successfully'
            )
        )
    }),
}

export default brokerController
