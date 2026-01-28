/**
 * Party Controller
 * ================
 * HTTP request handlers for party operations
 */
import ApiError from '../../../shared/utils/api-error.js'
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import partyService from '../services/party.service.js'

const partyController = {
    /**
     * Get all parties
     * GET /api/v1/mills/:millId/parties
     */
    getAll: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const filters = {
            millId,
            page: req.query?.page,
            limit: req.query?.limit,
            partyType: req.query?.partyType,
            search: req.query?.search,
            sortBy: req.query?.sortBy,
            sortOrder: req.query?.sortOrder,
            hasBalance: req.query?.hasBalance,
        }

        const parties = await partyService.findAll(filters)

        res.json(
            ApiResponse.paginated(parties, 'Parties retrieved successfully')
        )
    }),

    /**
     * Get party by ID
     * GET /api/v1/mills/:millId/parties/:partyId
     */
    getById: asyncHandler(async (req, res) => {
        const { millId, partyId } = req.params

        const party = await partyService.findById(partyId, millId)

        if (!party) {
            throw ApiError.notFound('Party not found')
        }

        res.json(ApiResponse.success(party, 'Party retrieved successfully'))
    }),

    /**
     * Create new party
     * POST /api/v1/mills/:millId/parties
     */
    create: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const partyData = { ...req.body, millId }

        try {
            const party = await partyService.create(partyData)

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('party:created', party)
            }

            res.status(201).json(
                ApiResponse.created(party, 'Party created successfully')
            )
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw ApiError.conflict(error.message)
            }
            throw error
        }
    }),

    /**
     * Update party
     * PUT /api/v1/mills/:millId/parties/:partyId
     */
    update: asyncHandler(async (req, res) => {
        const { millId, partyId } = req.params
        const updateData = req.body

        try {
            const party = await partyService.update(partyId, millId, updateData)

            if (!party) {
                throw ApiError.notFound('Party not found')
            }

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('party:updated', party)
            }

            res.json(ApiResponse.success(party, 'Party updated successfully'))
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw ApiError.conflict(error.message)
            }
            throw error
        }
    }),

    /**
     * Delete party
     * DELETE /api/v1/mills/:millId/parties/:partyId
     */
    delete: asyncHandler(async (req, res) => {
        const { millId, partyId } = req.params

        try {
            const party = await partyService.delete(partyId, millId)

            if (!party) {
                throw ApiError.notFound('Party not found')
            }

            // Emit socket event
            const io = req.app.get('io')
            if (io) {
                io.to(`mill:${millId}`).emit('party:deleted', { id: partyId })
            }

            res.json(ApiResponse.success(null, 'Party deleted successfully'))
        } catch (error) {
            if (error.message.includes('Cannot delete')) {
                throw ApiError.badRequest(error.message)
            }
            throw error
        }
    }),

    /**
     * Get party ledger
     * GET /api/v1/mills/:millId/parties/:partyId/ledger
     */
    getLedger: asyncHandler(async (req, res) => {
        const { millId, partyId } = req.params
        const filters = {
            startDate: req.query?.startDate,
            endDate: req.query?.endDate,
            page: req.query?.page,
            limit: req.query?.limit,
        }

        const ledger = await partyService.getLedger(partyId, millId, filters)

        if (!ledger) {
            throw ApiError.notFound('Party not found')
        }

        res.json(
            ApiResponse.success(ledger, 'Party ledger retrieved successfully')
        )
    }),

    /**
     * Get parties summary
     * GET /api/v1/mills/:millId/parties/summary
     */
    getSummary: asyncHandler(async (req, res) => {
        const { millId } = req.params

        const summary = await partyService.getSummary(millId)

        res.json(
            ApiResponse.success(
                summary[0] || {
                    totalParties: 0,
                    byStatus: [],
                    overallBalance: 0,
                    totalReceivable: 0,
                    totalPayable: 0,
                },
                'Party summary retrieved successfully'
            )
        )
    }),

    /**
     * Get outstanding balances
     * GET /api/v1/mills/:millId/parties/outstanding
     */
    getOutstanding: asyncHandler(async (req, res) => {
        const { millId } = req.params
        const filters = {
            type: req.query?.type,
            sortBy: req.query?.sortBy,
            sortOrder: req.query?.sortOrder,
        }

        const outstanding = await partyService.getOutstandingBalances(
            millId,
            filters
        )

        res.json(
            ApiResponse.success(
                outstanding,
                'Outstanding balances retrieved successfully'
            )
        )
    }),

    /**
     * Toggle party status
     * PATCH /api/v1/mills/:millId/parties/:partyId/toggle-status
     */
    toggleStatus: asyncHandler(async (req, res) => {
        const { millId, partyId } = req.params

        const party = await partyService.toggleStatus(partyId, millId)

        if (!party) {
            throw ApiError.notFound('Party not found')
        }

        // Emit socket event
        const io = req.app.get('io')
        if (io) {
            io.to(`mill:${millId}`).emit('party:statusToggled', party)
        }

        res.json(
            ApiResponse.success(
                party,
                `Party ${party.isActive ? 'activated' : 'deactivated'} successfully`
            )
        )
    }),
}

export default partyController
