import {
    createBalanceLiftingPartyEntry,
    getBalanceLiftingPartyById,
    getBalanceLiftingPartyList,
    getBalanceLiftingPartySummary,
    updateBalanceLiftingPartyEntry,
    deleteBalanceLiftingPartyEntry,
    bulkDeleteBalanceLiftingPartyEntries,
} from '../services/balance-lifting-party.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createBalanceLiftingParty = async (req, res, next) => {
    try {
        const entry = await createBalanceLiftingPartyEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Balance lifting party created')
        )
    } catch (error) {
        next(error)
    }
}

export const getBalanceLiftingPartyByIdHandler = async (req, res, next) => {
    try {
        const entry = await getBalanceLiftingPartyById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Balance lifting party retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getBalanceLiftingPartyListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getBalanceLiftingPartyList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { data: result.data, pagination: result.pagination },
                'Balance lifting party list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBalanceLiftingPartySummaryHandler = async (req, res, next) => {
    try {
        const summary = await getBalanceLiftingPartySummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Balance lifting party summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateBalanceLiftingPartyHandler = async (req, res, next) => {
    try {
        const entry = await updateBalanceLiftingPartyEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Balance lifting party updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteBalanceLiftingPartyHandler = async (req, res, next) => {
    try {
        await deleteBalanceLiftingPartyEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Balance lifting party deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteBalanceLiftingPartyHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteBalanceLiftingPartyEntries(
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
