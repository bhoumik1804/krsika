import {
    createStaffReportEntry,
    getStaffReportById,
    getStaffReportList,
    getStaffReportSummary,
    updateStaffReportEntry,
    deleteStaffReportEntry,
    bulkDeleteStaffReportEntries,
} from '../services/staff-report.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createStaffReport = async (req, res, next) => {
    try {
        const staff = await createStaffReportEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { staff }, 'Staff created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffReportByIdHandler = async (req, res, next) => {
    try {
        const staff = await getStaffReportById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { staff }, 'Staff retrieved successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffReportListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getStaffReportList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { staff: result.data, pagination: result.pagination },
                'Staff list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffReportSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getStaffReportSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Staff summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateStaffReportHandler = async (req, res, next) => {
    try {
        const staff = await updateStaffReportEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { staff }, 'Staff updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteStaffReportHandler = async (req, res, next) => {
    try {
        await deleteStaffReportEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Staff deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteStaffReportHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteStaffReportEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} staff members deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
