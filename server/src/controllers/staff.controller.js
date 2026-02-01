import {
    createStaffEntry,
    getStaffById,
    getStaffList,
    getStaffSummary,
    updateStaffEntry,
    deleteStaffEntry,
    bulkDeleteStaffEntries,
} from '../services/staff.service.js'

/**
 * Staff Controller
 * HTTP request handlers for staff endpoints (Mill Admin operations)
 */

/**
 * Create a new staff member
 * POST /api/mills/:millId/staff
 */
export const createStaff = async (req, res, next) => {
    try {
        const { millId } = req.params
        const adminId = req.user._id

        const staff = await createStaffEntry(millId, req.body, adminId)

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
 * Get all staff members with pagination
 * GET /api/mills/:millId/staff
 */
export const getStaffListHandler = async (req, res, next) => {
    try {
        const { millId } = req.params
        const { page, limit, search, isActive, sortBy, sortOrder } = req.query

        const result = await getStaffList(millId, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            search: search || '',
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'desc',
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result.data,
            pagination: result.pagination,
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
 * Update staff member
 * PUT /api/mills/:millId/staff/:id
 */
export const updateStaffHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const adminId = req.user._id

        const staff = await updateStaffEntry(millId, id, req.body, adminId)

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
 * Delete staff member
 * DELETE /api/mills/:millId/staff/:id
 */
export const deleteStaffHandler = async (req, res, next) => {
    try {
        const { millId, id } = req.params
        const adminId = req.user._id

        await deleteStaffEntry(millId, id, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
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
        const adminId = req.user._id

        const result = await bulkDeleteStaffEntries(millId, ids, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Staff members deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}
