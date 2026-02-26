import {
    createFrkOutwardEntry,
    getFrkOutwardById,
    getFrkOutwardList,
    getFrkOutwardSummary,
    updateFrkOutwardEntry,
    deleteFrkOutwardEntry,
    bulkDeleteFrkOutwardEntries,
} from '../services/frk-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createFrkOutward = async (req, res, next) => {
    try {
        const entry = await createFrkOutwardEntry(req.params.millId, req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { entry }, 'FRK outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getFrkOutwardById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'FRK outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getFrkOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'FRK outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getFrkOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'FRK outward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateFrkOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateFrkOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'FRK outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteFrkOutwardHandler = async (req, res, next) => {
    try {
        await deleteFrkOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'FRK outward deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteFrkOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteFrkOutwardEntries(
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
