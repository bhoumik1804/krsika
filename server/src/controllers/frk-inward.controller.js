import {
    createFrkInwardEntry,
    getFrkInwardById,
    getFrkInwardList,
    getFrkInwardSummary,
    updateFrkInwardEntry,
    deleteFrkInwardEntry,
    bulkDeleteFrkInwardEntries,
} from '../services/frk-inward.service.js'

/**
 * FRK Inward Controller
 * HTTP request handlers for FRK inward endpoints
 */

/**
 * Create a new FRK inward entry
 * POST /api/mills/:millId/frk-inward
 */
export const createFrkInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const frkInward = await createFrkInwardEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: frkInward,
            message: 'FRK inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK inward entry by ID
 * GET /api/mills/:millId/frk-inward/:id
 */
export const getFrkInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const frkInward = await getFrkInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: frkInward,
            message: 'FRK inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK inward list with pagination
 * GET /api/mills/:millId/frk-inward
 */
export const getFrkInwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getFrkInwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'FRK inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get FRK inward summary statistics
 * GET /api/mills/:millId/frk-inward/summary
 */
export const getFrkInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getFrkInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'FRK inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a FRK inward entry
 * PUT /api/mills/:millId/frk-inward/:id
 */
export const updateFrkInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const frkInward = await updateFrkInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: frkInward,
            message: 'FRK inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a FRK inward entry
 * DELETE /api/mills/:millId/frk-inward/:id
 */
export const deleteFrkInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteFrkInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'FRK inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete FRK inward entries
 * DELETE /api/mills/:millId/frk-inward/bulk
 */
export const bulkDeleteFrkInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteFrkInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} FRK inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
