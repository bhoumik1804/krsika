import {
    createRiceInwardEntry,
    getRiceInwardById,
    getRiceInwardList,
    getRiceInwardSummary,
    updateRiceInwardEntry,
    deleteRiceInwardEntry,
    bulkDeleteRiceInwardEntries,
} from '../services/rice-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createRiceInward = async (req, res, next) => {
    try {
        const entry = await createRiceInwardEntry(req.params.millId, req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Rice inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getRiceInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getRiceInwardById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Rice inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getRiceInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query
        const result = await getRiceInwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Rice inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getRiceInwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getRiceInwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Rice inward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateRiceInwardHandler = async (req, res, next) => {
    try {
        const entry = await updateRiceInwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Rice inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteRiceInwardHandler = async (req, res, next) => {
    try {
        await deleteRiceInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Rice inward deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteRiceInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteRiceInwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} entries deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
