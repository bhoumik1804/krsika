import {
    createGunnySaleEntry,
    getGunnySaleById,
    getGunnySaleList,
    getGunnySaleSummary,
    updateGunnySaleEntry,
    deleteGunnySaleEntry,
    bulkDeleteGunnySaleEntries,
} from '../services/gunny-sale.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createGunnySale = async (req, res, next) => {
    try {
        const sale = await createGunnySaleEntry(req.params.millId, req.body)
        res.status(201).json(
            new ApiResponse(201, { sale }, 'Gunny sale created')
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnySaleByIdHandler = async (req, res, next) => {
    try {
        const sale = await getGunnySaleById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Gunny sale retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnySaleListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, startDate, endDate, sortBy, sortOrder } =
            req.query
        const result = await getGunnySaleList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { sales: result.data, pagination: result.pagination },
                'Gunny sale list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGunnySaleSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getGunnySaleSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Gunny sale summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateGunnySaleHandler = async (req, res, next) => {
    try {
        const sale = await updateGunnySaleEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { sale }, 'Gunny sale updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGunnySaleHandler = async (req, res, next) => {
    try {
        await deleteGunnySaleEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Gunny sale deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteGunnySaleHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteGunnySaleEntries(
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
