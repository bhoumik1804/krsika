import {
    createLabourInwardEntry,
    getLabourInwardById,
    getLabourInwardList,
    getLabourInwardSummary,
    updateLabourInwardEntry,
    deleteLabourInwardEntry,
    bulkDeleteLabourInwardEntries,
} from '../services/labour-inward.service.js'

/**
 * Labour Inward Controller
 * HTTP request handlers for labour inward endpoints
 */

/**
 * Create a new labour inward entry
 * POST /api/mills/:millId/labour-inward
 */
export const createLabourInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const labourInward = await createLabourInwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: labourInward,
            message: 'Labour inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour inward entry by ID
 * GET /api/mills/:millId/labour-inward/:id
 */
export const getLabourInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const labourInward = await getLabourInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourInward,
            message: 'Labour inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour inward list with pagination
 * GET /api/mills/:millId/labour-inward
 */
export const getLabourInwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getLabourInwardList(millId, {
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
            message: 'Labour inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour inward summary statistics
 * GET /api/mills/:millId/labour-inward/summary
 */
export const getLabourInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getLabourInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Labour inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a labour inward entry
 * PUT /api/mills/:millId/labour-inward/:id
 */
export const updateLabourInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const labourInward = await updateLabourInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourInward,
            message: 'Labour inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a labour inward entry
 * DELETE /api/mills/:millId/labour-inward/:id
 */
export const deleteLabourInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteLabourInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Labour inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete labour inward entries
 * DELETE /api/mills/:millId/labour-inward/bulk
 */
export const bulkDeleteLabourInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteLabourInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} labour inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
