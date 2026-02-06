import {
    createFrkInwardEntry,
    getFrkInwardById,
    getFrkInwardList,
    getFrkInwardSummary,
    updateFrkInwardEntry,
    deleteFrkInwardEntry,
    bulkDeleteFrkInwardEntries,
} from '../services/frk-inward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createFrkInward = async (req, res, next) => {
    try {
        const entry = await createFrkInwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'FRK inward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkInwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getFrkInwardById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'FRK inward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkInwardListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getFrkInwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'FRK inward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkInwardSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getFrkInwardSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'FRK inward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateFrkInwardHandler = async (req, res, next) => {
    try {
        const entry = await updateFrkInwardEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'FRK inward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteFrkInwardHandler = async (req, res, next) => {
    try {
        await deleteFrkInwardEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'FRK inward deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteFrkInwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteFrkInwardEntries(
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
