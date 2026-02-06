import {
    createOtherSaleEntry,
    getOtherSaleById,
    getOtherSaleList,
    getOtherSaleSummary,
    updateOtherSaleEntry,
    deleteOtherSaleEntry,
    bulkDeleteOtherSaleEntries,
} from '../services/other-sale.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createOtherSale = async (req, res, next) => {
    try {
        const sale = await createOtherSaleEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { sale }, 'Other sale created')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherSaleByIdHandler = async (req, res, next) => {
    try {
        const sale = await getOtherSaleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Other sale retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherSaleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getOtherSaleList(req.params.millId, {
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
                'Other sale list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getOtherSaleSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getOtherSaleSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Other sale summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateOtherSaleHandler = async (req, res, next) => {
    try {
        const sale = await updateOtherSaleEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Other sale updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteOtherSaleHandler = async (req, res, next) => {
    try {
        await deleteOtherSaleEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Other sale deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteOtherSaleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteOtherSaleEntries(
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
