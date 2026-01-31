import {
    createPrivateRiceOutwardEntry,
    getPrivateRiceOutwardById,
    getPrivateRiceOutwardList,
    getPrivateRiceOutwardSummary,
    updatePrivateRiceOutwardEntry,
    deletePrivateRiceOutwardEntry,
    bulkDeletePrivateRiceOutwardEntries,
} from '../services/private-rice-outward.service.js'

/**
 * Private Rice Outward Controller
 * HTTP request handlers for private rice outward endpoints
 */

/**
 * Create a new private rice outward entry
 * POST /api/mills/:millId/private-rice-outward
 */
export const createPrivateRiceOutward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const privateRiceOutward = await createPrivateRiceOutwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: privateRiceOutward,
            message: 'Private rice outward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get private rice outward entry by ID
 * GET /api/mills/:millId/private-rice-outward/:id
 */
export const getPrivateRiceOutwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const privateRiceOutward = await getPrivateRiceOutwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: privateRiceOutward,
            message: 'Private rice outward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get private rice outward list with pagination
 * GET /api/mills/:millId/private-rice-outward
 */
export const getPrivateRiceOutwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            riceType,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getPrivateRiceOutwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            riceType,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Private rice outward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get private rice outward summary statistics
 * GET /api/mills/:millId/private-rice-outward/summary
 */
export const getPrivateRiceOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getPrivateRiceOutwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Private rice outward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a private rice outward entry
 * PUT /api/mills/:millId/private-rice-outward/:id
 */
export const updatePrivateRiceOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const privateRiceOutward = await updatePrivateRiceOutwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: privateRiceOutward,
            message: 'Private rice outward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a private rice outward entry
 * DELETE /api/mills/:millId/private-rice-outward/:id
 */
export const deletePrivateRiceOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deletePrivateRiceOutwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Private rice outward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete private rice outward entries
 * DELETE /api/mills/:millId/private-rice-outward/bulk
 */
export const bulkDeletePrivateRiceOutwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeletePrivateRiceOutwardEntries(
            millId,
            ids
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} private rice outward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
