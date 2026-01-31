import {
    createGunnyInwardEntry,
    getGunnyInwardById,
    getGunnyInwardList,
    getGunnyInwardSummary,
    updateGunnyInwardEntry,
    deleteGunnyInwardEntry,
    bulkDeleteGunnyInwardEntries,
} from '../services/gunny-inward.service.js'

/**
 * Gunny Inward Controller
 * HTTP request handlers for gunny inward endpoints
 */

/**
 * Create a new gunny inward entry
 * POST /api/mills/:millId/gunny-inward
 */
export const createGunnyInward = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const gunnyInward = await createGunnyInwardEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: gunnyInward,
            message: 'Gunny inward entry created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny inward entry by ID
 * GET /api/mills/:millId/gunny-inward/:id
 */
export const getGunnyInwardByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const gunnyInward = await getGunnyInwardById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: gunnyInward,
            message: 'Gunny inward entry retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny inward list with pagination
 * GET /api/mills/:millId/gunny-inward
 */
export const getGunnyInwardListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            gunnyType,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getGunnyInwardList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            gunnyType,
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
            message: 'Gunny inward list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get gunny inward summary statistics
 * GET /api/mills/:millId/gunny-inward/summary
 */
export const getGunnyInwardSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { startDate, endDate } = req.query

        const summary = await getGunnyInwardSummary(millId, {
            startDate,
            endDate,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Gunny inward summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a gunny inward entry
 * PUT /api/mills/:millId/gunny-inward/:id
 */
export const updateGunnyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const gunnyInward = await updateGunnyInwardEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: gunnyInward,
            message: 'Gunny inward entry updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a gunny inward entry
 * DELETE /api/mills/:millId/gunny-inward/:id
 */
export const deleteGunnyInwardHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteGunnyInwardEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Gunny inward entry deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete gunny inward entries
 * DELETE /api/mills/:millId/gunny-inward/bulk
 */
export const bulkDeleteGunnyInwardHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteGunnyInwardEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} gunny inward entries deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
