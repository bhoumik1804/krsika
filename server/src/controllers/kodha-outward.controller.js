import {
    createKodhaOutwardEntry,
    getKodhaOutwardById,
    getKodhaOutwardList,
    getKodhaOutwardSummary,
    updateKodhaOutwardEntry,
    deleteKodhaOutwardEntry,
    bulkDeleteKodhaOutwardEntries,
} from '../services/kodha-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createKodhaOutward = async (req, res, next) => {
    try {
        const entry = await createKodhaOutwardEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Kodha outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getKodhaOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getKodhaOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Kodha outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getKodhaOutwardListHandler = async (req, res, next) => {
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
        const result = await getKodhaOutwardList(req.params.millId, {
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
                'Kodha outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getKodhaOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getKodhaOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Kodha outward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateKodhaOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateKodhaOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Kodha outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteKodhaOutwardHandler = async (req, res, next) => {
    try {
        await deleteKodhaOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Kodha outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteKodhaOutwardHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteKodhaOutwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(200, result, 'Kodha outward entries deleted')
        )
    } catch (error) {
        next(error)
    }
}
