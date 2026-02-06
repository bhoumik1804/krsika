import {
    createTransporterEntry,
    getTransporterById,
    getTransporterList,
    getTransporterSummary,
    updateTransporterEntry,
    deleteTransporterEntry,
    bulkDeleteTransporterEntries,
} from '../services/transporter.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createTransporter = async (req, res, next) => {
    try {
        const transporter = await createTransporterEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { transporter },
                'Transporter created successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getTransporterByIdHandler = async (req, res, next) => {
    try {
        const transporter = await getTransporterById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { transporter },
                'Transporter retrieved successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getTransporterListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getTransporterList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { transporters: result.data, pagination: result.pagination },
                'Transporter list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getTransporterSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getTransporterSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Transporter summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateTransporterHandler = async (req, res, next) => {
    try {
        const transporter = await updateTransporterEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { transporter },
                'Transporter updated successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteTransporterHandler = async (req, res, next) => {
    try {
        await deleteTransporterEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Transporter deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteTransporterHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteTransporterEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} transporters deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
