import {
    createOtherOutwardEntry,
    getOtherOutwardById,
    getOtherOutwardList,
    getOtherOutwardSummary,
    updateOtherOutwardEntry,
    deleteOtherOutwardEntry,
    bulkDeleteOtherOutwardEntries,
} from '../services/other-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createOtherOutward = async (req, res, next) => {
    try {
        const entry = await createOtherOutwardEntry(req.params.millId, req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Other outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getOtherOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Other outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            partyName,
            brokerName,
            itemName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getOtherOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            partyName,
            brokerName,
            itemName,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Other outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getOtherOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Other outward summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateOtherOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateOtherOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Other outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteOtherOutwardHandler = async (req, res, next) => {
    try {
        await deleteOtherOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Other outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteOtherOutwardHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteOtherOutwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(200, result, 'Other outward entries deleted')
        )
    } catch (error) {
        next(error)
    }
}
