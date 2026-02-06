import {
    createOtherPurchaseEntry,
    getOtherPurchaseById,
    getOtherPurchaseList,
    getOtherPurchaseSummary,
    updateOtherPurchaseEntry,
    deleteOtherPurchaseEntry,
    bulkDeleteOtherPurchaseEntries,
} from '../services/other-purchase.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createOtherPurchase = async (req, res, next) => {
    try {
        const purchase = await createOtherPurchaseEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { purchase }, 'Other purchase created')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherPurchaseByIdHandler = async (req, res, next) => {
    try {
        const purchase = await getOtherPurchaseById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Other purchase retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherPurchaseListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getOtherPurchaseList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { purchases: result.data, pagination: result.pagination },
                'Other purchase list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getOtherPurchaseSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Other purchase summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateOtherPurchaseHandler = async (req, res, next) => {
    try {
        const purchase = await updateOtherPurchaseEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Other purchase updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteOtherPurchaseHandler = async (req, res, next) => {
    try {
        await deleteOtherPurchaseEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Other purchase deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteOtherPurchaseHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteOtherPurchaseEntries(
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
