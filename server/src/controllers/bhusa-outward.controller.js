import {
    createBhusaOutwardEntry,
    getBhusaOutwardById,
    getBhusaOutwardList,
    getBhusaOutwardSummary,
    updateBhusaOutwardEntry,
    deleteBhusaOutwardEntry,
    bulkDeleteBhusaOutwardEntries,
} from '../services/bhusa-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createBhusaOutward = async (req, res, next) => {
    try {
        const entry = await createBhusaOutwardEntry(req.params.millId, req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Bhusa outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getBhusaOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getBhusaOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Bhusa outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getBhusaOutwardListHandler = async (req, res, next) => {
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
        const result = await getBhusaOutwardList(req.params.millId, {
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
                'Bhusa outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBhusaOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getBhusaOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Bhusa outward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateBhusaOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateBhusaOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Bhusa outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteBhusaOutwardHandler = async (req, res, next) => {
    try {
        await deleteBhusaOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Bhusa outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteBhusaOutwardHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteBhusaOutwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(200, result, 'Bhusa outward entries deleted')
        )
    } catch (error) {
        next(error)
    }
}
