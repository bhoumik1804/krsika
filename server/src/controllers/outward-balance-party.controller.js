import {
    createOutwardBalancePartyEntry,
    getOutwardBalancePartyById,
    getOutwardBalancePartyList,
    getOutwardBalancePartySummary,
    updateOutwardBalancePartyEntry,
    deleteOutwardBalancePartyEntry,
    bulkDeleteOutwardBalancePartyEntries,
} from '../services/outward-balance-party.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createOutwardBalanceParty = async (req, res, next) => {
    try {
        const entry = await createOutwardBalancePartyEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Outward balance party created')
        )
    } catch (error) {
        next(error)
    }
}

export const getOutwardBalancePartyByIdHandler = async (req, res, next) => {
    try {
        const entry = await getOutwardBalancePartyById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Outward balance party retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getOutwardBalancePartyListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getOutwardBalancePartyList(req.params.millId, {
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
                'Outward balance party list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getOutwardBalancePartySummaryHandler = async (req, res, next) => {
    try {
        const summary = await getOutwardBalancePartySummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Outward balance party summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateOutwardBalancePartyHandler = async (req, res, next) => {
    try {
        const entry = await updateOutwardBalancePartyEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Outward balance party updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteOutwardBalancePartyHandler = async (req, res, next) => {
    try {
        await deleteOutwardBalancePartyEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Outward balance party deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteOutwardBalancePartyHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteOutwardBalancePartyEntries(
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
