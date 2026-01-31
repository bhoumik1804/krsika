import {
    createGovtPaddyInwardEntry,
    getGovtPaddyInwardById,
    getGovtPaddyInwardList,
    getGovtPaddyInwardSummary,
    updateGovtPaddyInwardEntry,
    deleteGovtPaddyInwardEntry,
    bulkDeleteGovtPaddyInwardEntries,
} from '../services/govt-paddy-inward.service.js'

/**
 * Govt Paddy Inward Controller
 * HTTP request handlers for govt paddy inward endpoints
 */

/**
 * Create a new govt paddy inward entry
 * POST /api/mills/:millId/govt-paddy-inward
 */
export const createGovtPaddyInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const govtPaddyInward = await createGovtPaddyInwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: govtPaddyInward,
            message: 'Govt paddy inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get govt paddy inward entry by ID
 * GET /api/mills/:millId/govt-paddy-inward/:id
 */
export const getGovtPaddyInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const govtPaddyInward = await getGovtPaddyInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: govtPaddyInward,
            message: 'Govt paddy inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get govt paddy inward list with pagination
 * GET /api/mills/:millId/govt-paddy-inward
 */
export const getGovtPaddyInwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            paddyType,
            committeeName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getGovtPaddyInwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            paddyType,
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
            message: 'Govt paddy inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get govt paddy inward summary statistics
 * GET /api/mills/:millId/govt-paddy-inward/summary
 */
export const getGovtPaddyInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getGovtPaddyInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Govt paddy inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a govt paddy inward entry
 * PUT /api/mills/:millId/govt-paddy-inward/:id
 */
export const updateGovtPaddyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const govtPaddyInward = await updateGovtPaddyInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: govtPaddyInward,
            message: 'Govt paddy inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a govt paddy inward entry
 * DELETE /api/mills/:millId/govt-paddy-inward/:id
 */
export const deleteGovtPaddyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteGovtPaddyInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Govt paddy inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete govt paddy inward entries
 * DELETE /api/mills/:millId/govt-paddy-inward/bulk
 */
export const bulkDeleteGovtPaddyInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteGovtPaddyInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} govt paddy inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
