import {
    createSilkyKodhaOutwardEntry,
    getSilkyKodhaOutwardById,
    getSilkyKodhaOutwardList,
    getSilkyKodhaOutwardSummary,
    updateSilkyKodhaOutwardEntry,
    deleteSilkyKodhaOutwardEntry,
    bulkDeleteSilkyKodhaOutwardEntries,
} from '../services/silky-kodha-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createSilkyKodhaOutward = async (req, res, next) => {
    try {
        const entry = await createSilkyKodhaOutwardEntry(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Silky kodha outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getSilkyKodhaOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getSilkyKodhaOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Silky kodha outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getSilkyKodhaOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getSilkyKodhaOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            brokerName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Silky kodha outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getSilkyKodhaOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getSilkyKodhaOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Silky kodha outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateSilkyKodhaOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateSilkyKodhaOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Silky kodha outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteSilkyKodhaOutwardHandler = async (req, res, next) => {
    try {
        await deleteSilkyKodhaOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Silky kodha outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteSilkyKodhaOutwardHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteSilkyKodhaOutwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(200, result, 'Silky kodha outward entries deleted')
        )
    } catch (error) {
        next(error)
    }
}
