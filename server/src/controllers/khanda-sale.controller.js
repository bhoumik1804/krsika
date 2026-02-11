import {
    createKhandaSaleEntry,
    getKhandaSaleById,
    getKhandaSaleList,
    getKhandaSaleSummary,
    updateKhandaSaleEntry,
    deleteKhandaSaleEntry,
    bulkDeleteKhandaSaleEntries,
} from '../services/khanda-sale.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createKhandaSale = async (req, res, next) => {
    try {
        const sale = await createKhandaSaleEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { sale }, 'Khanda sale created')
        )
    } catch (error) {
        next(error)
    }
}

export const getKhandaSaleByIdHandler = async (req, res, next) => {
    try {
        const sale = await getKhandaSaleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Khanda sale retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getKhandaSaleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getKhandaSaleList(req.params.millId, {
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
                'Khanda sale list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getKhandaSaleSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getKhandaSaleSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Khanda sale summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateKhandaSaleHandler = async (req, res, next) => {
    try {
        const sale = await updateKhandaSaleEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Khanda sale updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteKhandaSaleHandler = async (req, res, next) => {
    try {
        await deleteKhandaSaleEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Khanda sale deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteKhandaSaleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteKhandaSaleEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} khanda sales deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
