import {
    createNakkhiSaleEntry,
    getNakkhiSaleById,
    getNakkhiSaleList,
    getNakkhiSaleSummary,
    updateNakkhiSaleEntry,
    deleteNakkhiSaleEntry,
    bulkDeleteNakkhiSaleEntries,
} from '../services/nakkhi-sale.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createNakkhiSale = async (req, res, next) => {
    try {
        const sale = await createNakkhiSaleEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { sale }, 'Nakkhi sale created')
        )
    } catch (error) {
        next(error)
    }
}

export const getNakkhiSaleByIdHandler = async (req, res, next) => {
    try {
        const sale = await getNakkhiSaleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Nakkhi sale retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getNakkhiSaleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getNakkhiSaleList(req.params.millId, {
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
                'Nakkhi sale list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getNakkhiSaleSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getNakkhiSaleSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Nakkhi sale summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateNakkhiSaleHandler = async (req, res, next) => {
    try {
        const sale = await updateNakkhiSaleEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Nakkhi sale updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteNakkhiSaleHandler = async (req, res, next) => {
    try {
        await deleteNakkhiSaleEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Nakkhi sale deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteNakkhiSaleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteNakkhiSaleEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} nakkhi sales deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
