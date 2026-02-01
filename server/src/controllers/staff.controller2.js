import {
    createStaffEntry,
    getStaffById,
    getStaffList,
    getStaffSummary,
    updateStaffEntry,
    deleteStaffEntry,
    bulkDeleteStaffEntries,
    markStaffAttendance,
    bulkMarkStaffAttendance,
    getStaffAttendanceSummary,
    getBulkAttendanceSummary,
} from '../services/staff.service2.js'

/**
 * Staff Controller
 * HTTP request handlers for staff endpoints
 */

/**
 * Create a new staff member
 * POST /api/mills/:millId/staff
 */
export const createStaff = async (req, res, next) => {
    try {
        const { millId } = req.params
        const userId = req.user._id

        const staff = await createStaffEntry(millId, req.body, userId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: staff,
            message: 'Staff member created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get staff member by ID
 * GET /api/mills/:millId/staff/:id
 */
export const getStaffByIdHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        const staff = await getStaffById(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: staff,
            message: 'Staff member retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get staff list with pagination
 * GET /api/mills/:millId/staff
 */
export const getStaffListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const {
            page,
            limit,
            search,
            status,
            role,
            isPaymentDone,
            isMillVerified,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getStaffList(millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            status,
            role,
            isPaymentDone:
                isPaymentDone !== undefined
                    ? isPaymentDone === 'true'
                    : undefined,
            isMillVerified:
                isMillVerified !== undefined
                    ? isMillVerified === 'true'
                    : undefined,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Staff list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get staff summary statistics
 * GET /api/mills/:millId/staff/summary
 */
export const getStaffSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params

        const summary = await getStaffSummary(millId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Staff summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a staff member
 * PUT /api/mills/:millId/staff/:id
 */
export const updateStaffHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const userId = req.user._id

        const staff = await updateStaffEntry(millId, id, req.body, userId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: staff,
            message: 'Staff member updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a staff member
 * DELETE /api/mills/:millId/staff/:id
 */
export const deleteStaffHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params

        await deleteStaffEntry(millId, id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Staff member deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete staff members
 * DELETE /api/mills/:millId/staff/bulk
 */
export const bulkDeleteStaffHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { ids } = req.body

        const deletedCount = await bulkDeleteStaffEntries(millId, ids)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} staff members deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Mark attendance for a staff member
 * POST /api/mills/:millId/staff/:id/attendance
 */
export const markAttendanceHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const { date, status } = req.body

        const staff = await markStaffAttendance(millId, id, date, status)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: staff,
            message: 'Attendance marked successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk mark attendance for multiple staff members
 * POST /api/mills/:millId/staff/attendance/bulk
 */
export const bulkMarkAttendanceHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { date, attendanceRecords } = req.body

        const result = await bulkMarkStaffAttendance(
            millId,
            date,
            attendanceRecords
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: `Attendance marked for ${result.success} staff members`,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get attendance summary for a staff member
 * GET /api/mills/:millId/staff/:id/attendance/summary
 */
export const getAttendanceSummaryHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const { month, year } = req.query

        const summary = await getStaffAttendanceSummary(
            millId,
            id,
            parseInt(month, 10),
            parseInt(year, 10)
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Attendance summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get bulk attendance summary for all staff
 * GET /api/mills/:millId/staff/attendance/summary
 */
export const getBulkAttendanceSummaryHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { month, year } = req.query

        const summary = await getBulkAttendanceSummary(
            millId,
            parseInt(month, 10),
            parseInt(year, 10)
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Bulk attendance summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}
