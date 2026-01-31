import {
    createLabourOutwardEntry,
    getLabourOutwardById,
    getLabourOutwardList,
    getLabourOutwardSummary,
    updateLabourOutwardEntry,
    deleteLabourOutwardEntry,
    bulkDeleteLabourOutwardEntries,
} from '../services/labour-outward.service.js'

/**
 * Labour Outward Controller
 * HTTP request handlers for labour outward endpoints
 */

/**
 * Create a new labour outward entry
 * POST /api/mills/:millId/labour-outward
 */
export const createLabourOutward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const labourOutward = await createLabourOutwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: labourOutward,
            message: 'Labour outward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour outward entry by ID
 * GET /api/mills/:millId/labour-outward/:id
 */
export const getLabourOutwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const labourOutward = await getLabourOutwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourOutward,
            message: 'Labour outward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour outward list with pagination
 * GET /api/mills/:millId/labour-outward
 */
export const getLabourOutwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query

        const result = await getLabourOutwardList(millId, {
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
            message: 'Labour outward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get labour outward summary statistics
 * GET /api/mills/:millId/labour-outward/summary
 */
export const getLabourOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getLabourOutwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Labour outward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a labour outward entry
 * PUT /api/mills/:millId/labour-outward/:id
 */
export const updateLabourOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const labourOutward = await updateLabourOutwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: labourOutward,
            message: 'Labour outward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a labour outward entry
 * DELETE /api/mills/:millId/labour-outward/:id
 */
export const deleteLabourOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteLabourOutwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Labour outward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete labour outward entries
 * DELETE /api/mills/:millId/labour-outward/bulk
 */
export const bulkDeleteLabourOutwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteLabourOutwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} labour outward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
