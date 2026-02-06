import {
    createMillingRiceEntry,
    getMillingRiceById,
    getMillingRiceList,
    getMillingRiceSummary,
    updateMillingRiceEntry,
    deleteMillingRiceEntry,
    bulkDeleteMillingRiceEntries,
} from '../services/milling-rice.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createMillingRice = async (req, res, next) => {
    try {
        const entry = await createMillingRiceEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Milling rice created')
        )
    } catch (error) {
        next(error)
    }
}

export const getMillingRiceByIdHandler = async (req, res, next) => {
    try {
        const entry = await getMillingRiceById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Milling rice retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getMillingRiceListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getMillingRiceList(req.params.millId, {
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
                'Milling rice list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getMillingRiceSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getMillingRiceSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Milling rice summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateMillingRiceHandler = async (req, res, next) => {
    try {
        const entry = await updateMillingRiceEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Milling rice updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteMillingRiceHandler = async (req, res, next) => {
    try {
        await deleteMillingRiceEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Milling rice deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteMillingRiceHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteMillingRiceEntries(
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
