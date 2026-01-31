import {
    createCommitteeEntry,
    getCommitteeById,
    getCommitteeList,
    getCommitteeSummary,
    updateCommitteeEntry,
    deleteCommitteeEntry,
    bulkDeleteCommitteeEntries,
} from '../services/committee.service.js'

/**
 * Committee Controller
 * HTTP request handlers for committee endpoints
 */

/**
 * Create a new committee
 * POST /api/mills/:millId/committees
 */
export const createCommittee = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const committee = await createCommitteeEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: committee,
            message: 'Committee created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get committee by ID
 * GET /api/mills/:millId/committees/:id
 */
export const getCommitteeByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const committee = await getCommitteeById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: committee,
            message: 'Committee retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get committee list with pagination
 * GET /api/mills/:millId/committees
 */
export const getCommitteeListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getCommitteeList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Committee list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get committee summary statistics
 * GET /api/mills/:millId/committees/summary
 */
export const getCommitteeSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getCommitteeSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Committee summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a committee
 * PUT /api/mills/:millId/committees/:id
 */
export const updateCommitteeHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const committee = await updateCommitteeEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: committee,
            message: 'Committee updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a committee
 * DELETE /api/mills/:millId/committees/:id
 */
export const deleteCommitteeHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteCommitteeEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Committee deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete committees
 * DELETE /api/mills/:millId/committees/bulk
 */
export const bulkDeleteCommitteeHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteCommitteeEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} committees deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
