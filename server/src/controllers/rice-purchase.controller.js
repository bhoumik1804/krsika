import {
    createRicePurchaseEntry,
    getRicePurchaseById,
    getRicePurchaseList,
    getRicePurchaseSummary,
    updateRicePurchaseEntry,
    deleteRicePurchaseEntry,
    bulkDeleteRicePurchaseEntries,
} from '../services/rice-purchase.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createRicePurchase = async (req, res, next) => {
    try {
        const purchase = await createRicePurchaseEntry(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(201, { purchase }, 'Rice purchase created')
        )
    } catch (error) {
        next(error)
    }
}

export const getRicePurchaseByIdHandler = async (req, res, next) => {
    try {
        const purchase = await getRicePurchaseById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Rice purchase retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getRicePurchaseListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getRicePurchaseList(req.params.millId, {
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
                'Rice purchase list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getRicePurchaseSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getRicePurchaseSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Rice purchase summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateRicePurchaseHandler = async (req, res, next) => {
    try {
        const purchase = await updateRicePurchaseEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Rice purchase updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteRicePurchaseHandler = async (req, res, next) => {
    try {
        await deleteRicePurchaseEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Rice purchase deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteRicePurchaseHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteRicePurchaseEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} purchases deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
