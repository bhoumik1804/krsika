import {
    createGovtRiceOutwardEntry,
    getGovtRiceOutwardById,
    getGovtRiceOutwardList,
    getGovtRiceOutwardSummary,
    updateGovtRiceOutwardEntry,
    deleteGovtRiceOutwardEntry,
    bulkDeleteGovtRiceOutwardEntries,
} from '../services/govt-rice-outward.service.js'

/**
 * Govt Rice Outward Controller
 * HTTP request handlers for govt rice outward endpoints
 */

/**
 * Create a new govt rice outward entry
 * POST /api/mills/:millId/govt-rice-outward
 */
export const createGovtRiceOutward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const govtRiceOutward = await createGovtRiceOutwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: govtRiceOutward,
            message: 'Govt rice outward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get govt rice outward entry by ID
 * GET /api/mills/:millId/govt-rice-outward/:id
 */
export const getGovtRiceOutwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const govtRiceOutward = await getGovtRiceOutwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: govtRiceOutward,
            message: 'Govt rice outward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get govt rice outward list with pagination
 * GET /api/mills/:millId/govt-rice-outward
 */
export const getGovtRiceOutwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            riceType,
            lotNo,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getGovtRiceOutwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            riceType,
            lotNo,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Govt rice outward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get govt rice outward summary statistics
 * GET /api/mills/:millId/govt-rice-outward/summary
 */
export const getGovtRiceOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getGovtRiceOutwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Govt rice outward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a govt rice outward entry
 * PUT /api/mills/:millId/govt-rice-outward/:id
 */
export const updateGovtRiceOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const govtRiceOutward = await updateGovtRiceOutwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: govtRiceOutward,
            message: 'Govt rice outward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a govt rice outward entry
 * DELETE /api/mills/:millId/govt-rice-outward/:id
 */
export const deleteGovtRiceOutwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteGovtRiceOutwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Govt rice outward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete govt rice outward entries
 * DELETE /api/mills/:millId/govt-rice-outward/bulk
 */
export const bulkDeleteGovtRiceOutwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteGovtRiceOutwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} govt rice outward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
