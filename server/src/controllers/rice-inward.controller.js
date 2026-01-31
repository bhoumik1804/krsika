import {
    createRiceInwardEntry,
    getRiceInwardById,
    getRiceInwardList,
    getRiceInwardSummary,
    updateRiceInwardEntry,
    deleteRiceInwardEntry,
    bulkDeleteRiceInwardEntries,
} from '../services/rice-inward.service.js'

/**
 * Rice Inward Controller
 * HTTP request handlers for rice inward endpoints
 */

/**
 * Create a new rice inward entry
 * POST /api/mills/:millId/rice-inward
 */
export const createRiceInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const riceInward = await createRiceInwardEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: riceInward,
            message: 'Rice inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice inward entry by ID
 * GET /api/mills/:millId/rice-inward/:id
 */
export const getRiceInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const riceInward = await getRiceInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: riceInward,
            message: 'Rice inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice inward list with pagination
 * GET /api/mills/:millId/rice-inward
 */
export const getRiceInwardListHandler = async (req, res, next) => {
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

        const result = await getRiceInwardList(millId, {
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
            message: 'Rice inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get rice inward summary statistics
 * GET /api/mills/:millId/rice-inward/summary
 */
export const getRiceInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getRiceInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Rice inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a rice inward entry
 * PUT /api/mills/:millId/rice-inward/:id
 */
export const updateRiceInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const riceInward = await updateRiceInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: riceInward,
            message: 'Rice inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a rice inward entry
 * DELETE /api/mills/:millId/rice-inward/:id
 */
export const deleteRiceInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteRiceInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Rice inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete rice inward entries
 * DELETE /api/mills/:millId/rice-inward/bulk
 */
export const bulkDeleteRiceInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteRiceInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} rice inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
