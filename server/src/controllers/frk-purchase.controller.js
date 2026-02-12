import {
    createFrkPurchaseEntry,
    getFrkPurchaseById,
    getFrkPurchaseList,
    getFrkPurchaseSummary,
    updateFrkPurchaseEntry,
    deleteFrkPurchaseEntry,
    bulkDeleteFrkPurchaseEntries,
} from '../services/frk-purchase.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createFrkPurchase = async (req, res, next) => {
    try {
        const purchase = await createFrkPurchaseEntry(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(201, { purchase }, 'FRK purchase created')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkPurchaseByIdHandler = async (req, res, next) => {
    try {
        const purchase = await getFrkPurchaseById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'FRK purchase retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkPurchaseListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getFrkPurchaseList(req.params.millId, {
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
                'FRK purchase list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getFrkPurchaseSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'FRK purchase summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateFrkPurchaseHandler = async (req, res, next) => {
    try {
        const purchase = await updateFrkPurchaseEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'FRK purchase updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteFrkPurchaseHandler = async (req, res, next) => {
    try {
        await deleteFrkPurchaseEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'FRK purchase deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteFrkPurchaseHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteFrkPurchaseEntries(
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
