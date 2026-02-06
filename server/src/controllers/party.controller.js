import {
    createPartyEntry,
    getPartyById,
    getPartyList,
    getPartySummary,
    updatePartyEntry,
    deletePartyEntry,
    bulkDeletePartyEntries,
} from '../services/party.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createParty = async (req, res, next) => {
    try {
        const party = await createPartyEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { party }, 'Party created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getPartyByIdHandler = async (req, res, next) => {
    try {
        const party = await getPartyById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { party }, 'Party retrieved successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getPartyListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getPartyList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { parties: result.data, pagination: result.pagination },
                'Party list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPartySummaryHandler = async (req, res, next) => {
    try {
        const summary = await getPartySummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Party summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updatePartyHandler = async (req, res, next) => {
    try {
        const party = await updatePartyEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { party }, 'Party updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePartyHandler = async (req, res, next) => {
    try {
        await deletePartyEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Party deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePartyHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePartyEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} parties deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
