import {
    createKhandaOutwardEntry,
    getKhandaOutwardById,
    getKhandaOutwardList,
    getKhandaOutwardSummary,
    updateKhandaOutwardEntry,
    deleteKhandaOutwardEntry,
    bulkDeleteKhandaOutwardEntries,
} from '../services/khanda-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createKhandaOutward = async (req, res, next) => {
    try {
        const entry = await createKhandaOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Khanda outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getKhandaOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getKhandaOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Khanda outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getKhandaOutwardListHandler = async (req, res, next) => {
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
        const result = await getKhandaOutwardList(req.params.millId, {
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
                'Khanda outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getKhandaOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getKhandaOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Khanda outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateKhandaOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateKhandaOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Khanda outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteKhandaOutwardHandler = async (req, res, next) => {
    try {
        await deleteKhandaOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Khanda outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteKhandaOutwardHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteKhandaOutwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(200, result, 'Khanda outward entries deleted')
        )
    } catch (error) {
        next(error)
    }
}
