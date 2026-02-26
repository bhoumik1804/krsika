import {
    createDoReportEntry,
    bulkCreateDoReportEntries,
    getDoReportById,
    getDoReportList,
    getDoReportSummary,
    updateDoReportEntry,
    deleteDoReportEntry,
    bulkDeleteDoReportEntries,
} from '../services/do-report.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createDoReport = async (req, res, next) => {
    try {
        const report = await createDoReportEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { report }, 'DO report created')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkCreateDoReport = async (req, res, next) => {
    try {
        const reports = await bulkCreateDoReportEntries(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { reports, count: reports.length },
                `${reports.length} DO reports created successfully`
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDoReportByIdHandler = async (req, res, next) => {
    try {
        const report = await getDoReportById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { report }, 'DO report retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getDoReportListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getDoReportList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { reports: result.reports, pagination: result.pagination },
                'DO report list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getDoReportSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getDoReportSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'DO report summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateDoReportHandler = async (req, res, next) => {
    try {
        const report = await updateDoReportEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { report }, 'DO report updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteDoReportHandler = async (req, res, next) => {
    try {
        await deleteDoReportEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'DO report deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteDoReportHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteDoReportEntries(
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
