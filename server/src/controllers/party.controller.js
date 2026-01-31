import {
    createPartyEntry,
    getPartyById,
    getPartyList,
    getPartySummary,
    updatePartyEntry,
    deletePartyEntry,
    bulkDeletePartyEntries,
} from '../services/party.service.js'

/**
 * Party Controller
 * HTTP request handlers for party endpoints
 */

/**
 * Create a new party
 * POST /api/mills/:millId/parties
 */
export const createParty = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const party = await createPartyEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: party,
            message: 'Party created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get party by ID
 * GET /api/mills/:millId/parties/:id
 */
export const getPartyByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const party = await getPartyById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: party,
            message: 'Party retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get party list with pagination
 * GET /api/mills/:millId/parties
 */
export const getPartyListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getPartyList(millId, {
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
            message: 'Party list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get party summary statistics
 * GET /api/mills/:millId/parties/summary
 */
export const getPartySummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getPartySummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Party summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a party
 * PUT /api/mills/:millId/parties/:id
 */
export const updatePartyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const party = await updatePartyEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: party,
            message: 'Party updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a party
 * DELETE /api/mills/:millId/parties/:id
 */
export const deletePartyHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deletePartyEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Party deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete parties
 * DELETE /api/mills/:millId/parties/bulk
 */
export const bulkDeletePartyHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeletePartyEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} parties deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
