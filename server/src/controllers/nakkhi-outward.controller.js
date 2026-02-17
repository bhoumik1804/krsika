import {
    createNakkhiOutwardEntry,
    getNakkhiOutwardById,
    getNakkhiOutwardList,
    getNakkhiOutwardSummary,
    updateNakkhiOutwardEntry,
    deleteNakkhiOutwardEntry,
    bulkDeleteNakkhiOutwardEntries,
} from '../services/nakkhi-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createNakkhiOutward = async (req, res, next) => {
    try {
        const entry = await createNakkhiOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Nakkhi outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getNakkhiOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getNakkhiOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Nakkhi outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getNakkhiOutwardListHandler = async (req, res, next) => {
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
        const result = await getNakkhiOutwardList(req.params.millId, {
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
                'Nakkhi outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getNakkhiOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getNakkhiOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Nakkhi outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateNakkhiOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateNakkhiOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Nakkhi outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteNakkhiOutwardHandler = async (req, res, next) => {
    try {
        await deleteNakkhiOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Nakkhi outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteNakkhiOutwardHandler = async (req, res, next) => {
    try {
        const result = await bulkDeleteNakkhiOutwardEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(200, result, 'Nakkhi outward entries deleted')
        )
    } catch (error) {
        next(error)
    }
}
