import {
    createLabourMillingEntry,
    getLabourMillingById,
    getLabourMillingList,
    getLabourMillingSummary,
    updateLabourMillingEntry,
    deleteLabourMillingEntry,
    bulkDeleteLabourMillingEntries,
} from '../services/labour-milling.service.js'

/**
 * Labour Milling Controller
 * HTTP request handlers for labour milling endpoints
 */

/**
 * Create a new labour milling entry
 * POST /api/mills/:millId/labour-milling
 */
export const createLabourMilling = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const labourMilling = await createLabourMillingEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: labourMilling,
            message: 'Labour milling entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour milling entry by ID
 * GET /api/mills/:millId/labour-milling/:id
 */
export const getLabourMillingByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const labourMilling = await getLabourMillingById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourMilling,
            message: 'Labour milling entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour milling list with pagination
 * GET /api/mills/:millId/labour-milling
 */
export const getLabourMillingListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getLabourMillingList(millId, {
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
            message: 'Labour milling list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour milling summary statistics
 * GET /api/mills/:millId/labour-milling/summary
 */
export const getLabourMillingSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getLabourMillingSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Labour milling summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a labour milling entry
 * PUT /api/mills/:millId/labour-milling/:id
 */
export const updateLabourMillingHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const labourMilling = await updateLabourMillingEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourMilling,
            message: 'Labour milling entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a labour milling entry
 * DELETE /api/mills/:millId/labour-milling/:id
 */
export const deleteLabourMillingHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteLabourMillingEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Labour milling entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete labour milling entries
 * DELETE /api/mills/:millId/labour-milling/bulk
 */
export const bulkDeleteLabourMillingHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteLabourMillingEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} labour milling entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
