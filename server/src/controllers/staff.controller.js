import {
    createStaffEntry,
    getStaffById,
    getStaffList,
    getStaffSummary,
    updateStaffEntry,
    deleteStaffEntry,
    bulkDeleteStaffEntries,
} from '../services/staff.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Staff Controller (Mill Admin)
 */

export const createStaff = async (req, res, next) => {
    try {
        const staff = await createStaffEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { staff }, 'Staff member created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffByIdHandler = async (req, res, next) => {
    try {
        const staff = await getStaffById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(
                200,
                { staff },
                'Staff member retrieved successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, isActive, sortBy, sortOrder } = req.query
        const result = await getStaffList(req.params.millId, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            search: search || '',
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'desc',
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { staffList: result.data, pagination: result.pagination },
                'Staff list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getStaffSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Staff summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateStaffHandler = async (req, res, next) => {
    try {
        const staff = await updateStaffEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { staff }, 'Staff member updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteStaffHandler = async (req, res, next) => {
    try {
        await deleteStaffEntry(req.params.millId, req.params.id, req.user._id)
        res.status(200).json(
            new ApiResponse(200, null, 'Staff member deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteStaffHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteStaffEntries(
            req.params.millId,
            req.body.ids,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount: result.deletedCount },
                'Staff members deleted'
            )
        )
    } catch (error) {
        next(error)
    }
}
