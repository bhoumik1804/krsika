import {
    createRiceSaleEntry,
    getRiceSaleById,
    getRiceSaleList,
    getRiceSaleSummary,
    updateRiceSaleEntry,
    deleteRiceSaleEntry,
    bulkDeleteRiceSaleEntries,
} from '../services/rice-sale.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createRiceSale = async (req, res, next) => {
    try {
        const sale = await createRiceSaleEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { sale }, 'Rice sale created')
        )
    } catch (error) {
        next(error)
    }
}

export const getRiceSaleByIdHandler = async (req, res, next) => {
    try {
        const sale = await getRiceSaleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Rice sale retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getRiceSaleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getRiceSaleList(req.params.millId, {
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
                'Rice sale list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getRiceSaleSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getRiceSaleSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Rice sale summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateRiceSaleHandler = async (req, res, next) => {
    try {
        const sale = await updateRiceSaleEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Rice sale updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteRiceSaleHandler = async (req, res, next) => {
    try {
        await deleteRiceSaleEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Rice sale deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteRiceSaleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteRiceSaleEntries(
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
