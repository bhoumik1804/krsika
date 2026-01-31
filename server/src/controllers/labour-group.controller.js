import {
    createLabourGroupEntry,
    getLabourGroupById,
    getLabourGroupList,
    getLabourGroupSummary,
    updateLabourGroupEntry,
    deleteLabourGroupEntry,
    bulkDeleteLabourGroupEntries,
} from '../services/labour-group.service.js'

/**
 * Labour Group Controller
 * HTTP request handlers for labour group endpoints
 */

/**
 * Create a new labour group
 * POST /api/mills/:millId/labour-groups
 */
export const createLabourGroup = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const labourGroup = await createLabourGroupEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: labourGroup,
            message: 'Labour group created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour group by ID
 * GET /api/mills/:millId/labour-groups/:id
 */
export const getLabourGroupByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const labourGroup = await getLabourGroupById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourGroup,
            message: 'Labour group retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour group list with pagination
 * GET /api/mills/:millId/labour-groups
 */
export const getLabourGroupListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getLabourGroupList(millId, {
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
            message: 'Labour group list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour group summary statistics
 * GET /api/mills/:millId/labour-groups/summary
 */
export const getLabourGroupSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getLabourGroupSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Labour group summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a labour group
 * PUT /api/mills/:millId/labour-groups/:id
 */
export const updateLabourGroupHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const labourGroup = await updateLabourGroupEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourGroup,
            message: 'Labour group updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a labour group
 * DELETE /api/mills/:millId/labour-groups/:id
 */
export const deleteLabourGroupHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteLabourGroupEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Labour group deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete labour groups
 * DELETE /api/mills/:millId/labour-groups/bulk
 */
export const bulkDeleteLabourGroupHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteLabourGroupEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} labour groups deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
