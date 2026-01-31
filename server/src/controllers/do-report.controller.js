import {
    createDoReportEntry,
    getDoReportById,
    getDoReportList,
    getDoReportSummary,
    updateDoReportEntry,
    deleteDoReportEntry,
    bulkDeleteDoReportEntries,
} from '../services/do-report.service.js'

/**
 * DO Report Controller
 * HTTP request handlers for DO report endpoints
 */

/**
 * Create a new DO report
 * POST /api/mills/:millId/do-reports
 */
export const createDoReport = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const doReport = await createDoReportEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: doReport,
            message: 'DO report created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get DO report by ID
 * GET /api/mills/:millId/do-reports/:id
 */
export const getDoReportByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const doReport = await getDoReportById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: doReport,
            message: 'DO report retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get DO report list with pagination
 * GET /api/mills/:millId/do-reports
 */
export const getDoReportListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getDoReportList(millId, {
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
            message: 'DO report list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get DO report summary statistics
 * GET /api/mills/:millId/do-reports/summary
 */
export const getDoReportSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getDoReportSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'DO report summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a DO report
 * PUT /api/mills/:millId/do-reports/:id
 */
export const updateDoReportHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const doReport = await updateDoReportEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: doReport,
            message: 'DO report updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a DO report
 * DELETE /api/mills/:millId/do-reports/:id
 */
export const deleteDoReportHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteDoReportEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'DO report deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete DO reports
 * DELETE /api/mills/:millId/do-reports/bulk
 */
export const bulkDeleteDoReportHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteDoReportEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} DO reports deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
