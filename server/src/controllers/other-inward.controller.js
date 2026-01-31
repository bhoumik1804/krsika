import {
    createOtherInwardEntry,
    getOtherInwardById,
    getOtherInwardList,
    getOtherInwardSummary,
    updateOtherInwardEntry,
    deleteOtherInwardEntry,
    bulkDeleteOtherInwardEntries,
} from '../services/other-inward.service.js'

/**
 * Other Inward Controller
 * HTTP request handlers for other inward endpoints
 */

/**
 * Create a new other inward entry
 * POST /api/mills/:millId/other-inward
 */
export const createOtherInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const otherInward = await createOtherInwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: otherInward,
            message: 'Other inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other inward entry by ID
 * GET /api/mills/:millId/other-inward/:id
 */
export const getOtherInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const otherInward = await getOtherInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: otherInward,
            message: 'Other inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other inward list with pagination
 * GET /api/mills/:millId/other-inward
 */
export const getOtherInwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            partyName,
            itemName,
            unit,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getOtherInwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            itemName,
            unit,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Other inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get other inward summary statistics
 * GET /api/mills/:millId/other-inward/summary
 */
export const getOtherInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getOtherInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Other inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update an other inward entry
 * PUT /api/mills/:millId/other-inward/:id
 */
export const updateOtherInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const otherInward = await updateOtherInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: otherInward,
            message: 'Other inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete an other inward entry
 * DELETE /api/mills/:millId/other-inward/:id
 */
export const deleteOtherInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteOtherInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Other inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete other inward entries
 * DELETE /api/mills/:millId/other-inward/bulk
 */
export const bulkDeleteOtherInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteOtherInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} other inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
