import {
    createPaddyPurchaseEntry,
    getPaddyPurchaseById,
    getPaddyPurchaseList,
    getPaddyPurchaseSummary,
    updatePaddyPurchaseEntry,
    deletePaddyPurchaseEntry,
    bulkDeletePaddyPurchaseEntries,
} from '../services/paddy-purchase.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createPaddyPurchase = async (req, res, next) => {
    try {
        const purchase = await createPaddyPurchaseEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { purchase }, 'Paddy purchase created')
        )
    } catch (error) {
        next(error)
    }
}

export const getPaddyPurchaseByIdHandler = async (req, res, next) => {
    try {
        const purchase = await getPaddyPurchaseById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Paddy purchase retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getPaddyPurchaseListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getPaddyPurchaseList(req.params.millId, {
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
                'Paddy purchase list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getPaddyPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getPaddyPurchaseSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Paddy purchase summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updatePaddyPurchaseHandler = async (req, res, next) => {
    try {
        const purchase = await updatePaddyPurchaseEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Paddy purchase updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deletePaddyPurchaseHandler = async (req, res, next) => {
    try {
        await deletePaddyPurchaseEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Paddy purchase deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeletePaddyPurchaseHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeletePaddyPurchaseEntries(
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
