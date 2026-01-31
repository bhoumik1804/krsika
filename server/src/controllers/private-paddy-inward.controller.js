import {
    createPrivatePaddyInwardEntry,
    getPrivatePaddyInwardById,
    getPrivatePaddyInwardList,
    getPrivatePaddyInwardSummary,
    updatePrivatePaddyInwardEntry,
    deletePrivatePaddyInwardEntry,
    bulkDeletePrivatePaddyInwardEntries,
} from '../services/private-paddy-inward.service.js'

/**
 * Private Paddy Inward Controller
 * HTTP request handlers for private paddy inward endpoints
 */

/**
 * Create a new private paddy inward entry
 * POST /api/mills/:millId/private-paddy-inward
 */
export const createPrivatePaddyInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const privatePaddyInward = await createPrivatePaddyInwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: privatePaddyInward,
            message: 'Private paddy inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get private paddy inward entry by ID
 * GET /api/mills/:millId/private-paddy-inward/:id
 */
export const getPrivatePaddyInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const privatePaddyInward = await getPrivatePaddyInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: privatePaddyInward,
            message: 'Private paddy inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get private paddy inward list with pagination
 * GET /api/mills/:millId/private-paddy-inward
 */
export const getPrivatePaddyInwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            purchaseType,
            paddyType,
            partyName,
            brokerName,
            committeeName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getPrivatePaddyInwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            purchaseType,
            paddyType,
            partyName,
            brokerName,
            committeeName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Private paddy inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get private paddy inward summary statistics
 * GET /api/mills/:millId/private-paddy-inward/summary
 */
export const getPrivatePaddyInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getPrivatePaddyInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Private paddy inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a private paddy inward entry
 * PUT /api/mills/:millId/private-paddy-inward/:id
 */
export const updatePrivatePaddyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const privatePaddyInward = await updatePrivatePaddyInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: privatePaddyInward,
            message: 'Private paddy inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a private paddy inward entry
 * DELETE /api/mills/:millId/private-paddy-inward/:id
 */
export const deletePrivatePaddyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deletePrivatePaddyInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Private paddy inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete private paddy inward entries
 * DELETE /api/mills/:millId/private-paddy-inward/bulk
 */
export const bulkDeletePrivatePaddyInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeletePrivatePaddyInwardEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} private paddy inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
