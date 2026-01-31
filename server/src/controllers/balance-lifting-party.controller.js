import {
    createBalanceLiftingPartyEntry,
    getBalanceLiftingPartyById,
    getBalanceLiftingPartyList,
    getBalanceLiftingPartySummary,
    updateBalanceLiftingPartyEntry,
    deleteBalanceLiftingPartyEntry,
    bulkDeleteBalanceLiftingPartyEntries,
} from '../services/balance-lifting-party.service.js'

/**
 * Balance Lifting Party Controller
 * HTTP request handlers for balance lifting party endpoints
 */

/**
 * Create a new balance lifting party entry
 * POST /api/mills/:millId/balance-lifting-party
 */
export const createBalanceLiftingParty = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const balanceLiftingParty = await createBalanceLiftingPartyEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: balanceLiftingParty,
            message: 'Balance lifting party entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get balance lifting party entry by ID
 * GET /api/mills/:millId/balance-lifting-party/:id
 */
export const getBalanceLiftingPartyByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const balanceLiftingParty = await getBalanceLiftingPartyById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: balanceLiftingParty,
            message: 'Balance lifting party entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get balance lifting party list with pagination
 * GET /api/mills/:millId/balance-lifting-party
 */
export const getBalanceLiftingPartyListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getBalanceLiftingPartyList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Balance lifting party list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get balance lifting party summary statistics
 * GET /api/mills/:millId/balance-lifting-party/summary
 */
export const getBalanceLiftingPartySummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getBalanceLiftingPartySummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Balance lifting party summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a balance lifting party entry
 * PUT /api/mills/:millId/balance-lifting-party/:id
 */
export const updateBalanceLiftingPartyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const balanceLiftingParty = await updateBalanceLiftingPartyEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: balanceLiftingParty,
            message: 'Balance lifting party entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a balance lifting party entry
 * DELETE /api/mills/:millId/balance-lifting-party/:id
 */
export const deleteBalanceLiftingPartyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteBalanceLiftingPartyEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Balance lifting party entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete balance lifting party entries
 * DELETE /api/mills/:millId/balance-lifting-party/bulk
 */
export const bulkDeleteBalanceLiftingPartyHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteBalanceLiftingPartyEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} balance lifting party entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
