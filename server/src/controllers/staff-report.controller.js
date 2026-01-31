import {
    createStaffReportEntry,
    getStaffReportById,
    getStaffReportList,
    getStaffReportSummary,
    updateStaffReportEntry,
    deleteStaffReportEntry,
    bulkDeleteStaffReportEntries,
} from '../services/staff-report.service.js'

/**
 * Staff Report Controller
 * HTTP request handlers for staff report endpoints
 */

/**
 * Create a new staff report
 * POST /api/mills/:millId/staff-reports
 */
export const createStaffReport = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const staffReport = await createStaffReportEntry(
            millId,
            req.body,
            userId
        )

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: staffReport,
            message: 'Staff report created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get staff report by ID
 * GET /api/mills/:millId/staff-reports/:id
 */
export const getStaffReportByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const staffReport = await getStaffReportById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: staffReport,
            message: 'Staff report retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get staff report list with pagination
 * GET /api/mills/:millId/staff-reports
 */
export const getStaffReportListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, sortBy, sortOrder } = req.query

        const result = await getStaffReportList(millId, {
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
            message: 'Staff report list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get staff report summary statistics
 * GET /api/mills/:millId/staff-reports/summary
 */
export const getStaffReportSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getStaffReportSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Staff report summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a staff report
 * PUT /api/mills/:millId/staff-reports/:id
 */
export const updateStaffReportHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const staffReport = await updateStaffReportEntry(
            millId,
            id,
            req.body,
            userId
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: staffReport,
            message: 'Staff report updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a staff report
 * DELETE /api/mills/:millId/staff-reports/:id
 */
export const deleteStaffReportHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteStaffReportEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Staff report deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete staff reports
 * DELETE /api/mills/:millId/staff-reports/bulk
 */
export const bulkDeleteStaffReportHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteStaffReportEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} staff reports deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
