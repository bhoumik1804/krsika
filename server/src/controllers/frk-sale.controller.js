import {
    createFrkSaleEntry,
    getFrkSaleById,
    getFrkSaleList,
    getFrkSaleSummary,
    updateFrkSaleEntry,
    deleteFrkSaleEntry,
    bulkDeleteFrkSaleEntries,
} from '../services/frk-sale.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createFrkSale = async (req, res, next) => {
    try {
        const sale = await createFrkSaleEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(new ApiResponse(201, { sale }, 'FRK sale created'))
    } catch (error) {
        next(error)
    }
}

export const getFrkSaleByIdHandler = async (req, res, next) => {
    try {
        const sale = await getFrkSaleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { sale }, 'FRK sale retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkSaleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getFrkSaleList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { sales: result.data, pagination: result.pagination },
                'FRK sale list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getFrkSaleSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getFrkSaleSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'FRK sale summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateFrkSaleHandler = async (req, res, next) => {
    try {
        const sale = await updateFrkSaleEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(new ApiResponse(200, { sale }, 'FRK sale updated'))
    } catch (error) {
        next(error)
    }
}

export const deleteFrkSaleHandler = async (req, res, next) => {
    try {
        await deleteFrkSaleEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'FRK sale deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteFrkSaleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteFrkSaleEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} sales deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
