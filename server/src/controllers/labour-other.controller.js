import {
    createLabourOtherEntry,
    getLabourOtherById,
    getLabourOtherList,
    getLabourOtherSummary,
    updateLabourOtherEntry,
    deleteLabourOtherEntry,
    bulkDeleteLabourOtherEntries,
} from '../services/labour-other.service.js'

/**
 * Labour Other Controller
 * HTTP request handlers for labour other endpoints
 */

/**
 * Create a new labour other entry
 * POST /api/mills/:millId/labour-other
 */
export const createLabourOther = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const labourOther = await createLabourOtherEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: labourOther,
            message: 'Labour other entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour other entry by ID
 * GET /api/mills/:millId/labour-other/:id
 */
export const getLabourOtherByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const labourOther = await getLabourOtherById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourOther,
            message: 'Labour other entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour other list with pagination
 * GET /api/mills/:millId/labour-other
 */
export const getLabourOtherListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getLabourOtherList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Labour other list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour other summary statistics
 * GET /api/mills/:millId/labour-other/summary
 */
export const getLabourOtherSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getLabourOtherSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Labour other summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a labour other entry
 * PUT /api/mills/:millId/labour-other/:id
 */
export const updateLabourOtherHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const labourOther = await updateLabourOtherEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourOther,
            message: 'Labour other entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a labour other entry
 * DELETE /api/mills/:millId/labour-other/:id
 */
export const deleteLabourOtherHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteLabourOtherEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Labour other entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete labour other entries
 * DELETE /api/mills/:millId/labour-other/bulk
 */
export const bulkDeleteLabourOtherHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteLabourOtherEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} labour other entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
