import {
    createStockOverviewEntry,
    getStockOverviewById,
    getStockOverviewList,
    getStockOverviewSummary,
    updateStockOverviewEntry,
    deleteStockOverviewEntry,
    bulkDeleteStockOverviewEntries,
} from '../services/stock-overview.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createStockOverview = async (req, res, next) => {
    try {
        const stock = await createStockOverviewEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { stock }, 'Stock overview created')
        )
    } catch (error) {
        next(error)
    }
}

export const getStockOverviewByIdHandler = async (req, res, next) => {
    try {
        const stock = await getStockOverviewById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { stock }, 'Stock overview retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getStockOverviewListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getStockOverviewList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { stocks: result.data, pagination: result.pagination },
                'Stock overview list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getStockOverviewSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getStockOverviewSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Stock overview summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateStockOverviewHandler = async (req, res, next) => {
    try {
        const stock = await updateStockOverviewEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { stock }, 'Stock overview updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteStockOverviewHandler = async (req, res, next) => {
    try {
        await deleteStockOverviewEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Stock overview deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteStockOverviewHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteStockOverviewEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} entries deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
