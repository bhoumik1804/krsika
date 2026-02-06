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
        const report = await createStaffReportEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { report }, 'Staff report created')
        )
    } catch (error) {
        next(error)
    }
}

export const getStaffReportByIdHandler = async (req, res, next) => {
    try {
        const report = await getStaffReportById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { report }, 'Staff report retrieved')
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
                { reports: result.data, pagination: result.pagination },
                'Staff report list retrieved'
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
            new ApiResponse(200, { summary }, 'Staff report summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateStaffReportHandler = async (req, res, next) => {
    try {
        const report = await updateStaffReportEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { report }, 'Staff report updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteStaffReportHandler = async (req, res, next) => {
    try {
        await deleteStaffReportEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Staff report deleted'))
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
                `${deletedCount} reports deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
