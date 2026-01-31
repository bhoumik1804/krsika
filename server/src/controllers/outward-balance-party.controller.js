import {
    createOutwardBalancePartyEntry,
    getOutwardBalancePartyById,
    getOutwardBalancePartyList,
    getOutwardBalancePartySummary,
    updateOutwardBalancePartyEntry,
    deleteOutwardBalancePartyEntry,
    bulkDeleteOutwardBalancePartyEntries,
} from '../services/outward-balance-party.service.js'

/**
 * Outward Balance Party Controller
 * HTTP request handlers for outward balance party endpoints
 */

/**
 * Create a new outward balance party entry
 * POST /api/mills/:millId/outward-balance-party
 */
export const createOutwardBalanceParty = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const outwardBalanceParty = await createOutwardBalancePartyEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: outwardBalanceParty,
            message: 'Outward balance party entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get outward balance party entry by ID
 * GET /api/mills/:millId/outward-balance-party/:id
 */
export const getOutwardBalancePartyByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const outwardBalanceParty = await getOutwardBalancePartyById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: outwardBalanceParty,
            message: 'Outward balance party entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get outward balance party list with pagination
 * GET /api/mills/:millId/outward-balance-party
 */
export const getOutwardBalancePartyListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getOutwardBalancePartyList(millId, {
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
            message: 'Outward balance party list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get outward balance party summary statistics
 * GET /api/mills/:millId/outward-balance-party/summary
 */
export const getOutwardBalancePartySummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getOutwardBalancePartySummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Outward balance party summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update an outward balance party entry
 * PUT /api/mills/:millId/outward-balance-party/:id
 */
export const updateOutwardBalancePartyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const outwardBalanceParty = await updateOutwardBalancePartyEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: outwardBalanceParty,
            message: 'Outward balance party entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete an outward balance party entry
 * DELETE /api/mills/:millId/outward-balance-party/:id
 */
export const deleteOutwardBalancePartyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteOutwardBalancePartyEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Outward balance party entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete outward balance party entries
 * DELETE /api/mills/:millId/outward-balance-party/bulk
 */
export const bulkDeleteOutwardBalancePartyHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteOutwardBalancePartyEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} outward balance party entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
