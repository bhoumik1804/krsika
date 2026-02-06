import {
    createGunnyPurchaseEntry,
    getGunnyPurchaseById,
    getGunnyPurchaseList,
    getGunnyPurchaseSummary,
    updateGunnyPurchaseEntry,
    deleteGunnyPurchaseEntry,
    bulkDeleteGunnyPurchaseEntries,
} from '../services/gunny-purchase.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createGunnyPurchase = async (req, res, next) => {
    try {
        const purchase = await createGunnyPurchaseEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { purchase }, 'Gunny purchase created')
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnyPurchaseByIdHandler = async (req, res, next) => {
    try {
        const purchase = await getGunnyPurchaseById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Gunny purchase retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnyPurchaseListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getGunnyPurchaseList(req.params.millId, {
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
                'Gunny purchase list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnyPurchaseSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getGunnyPurchaseSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Gunny purchase summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateGunnyPurchaseHandler = async (req, res, next) => {
    try {
        const purchase = await updateGunnyPurchaseEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { purchase }, 'Gunny purchase updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGunnyPurchaseHandler = async (req, res, next) => {
    try {
        await deleteGunnyPurchaseEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Gunny purchase deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteGunnyPurchaseHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteGunnyPurchaseEntries(
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
