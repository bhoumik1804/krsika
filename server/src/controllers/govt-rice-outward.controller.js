import {
    createGovtRiceOutwardEntry,
    getGovtRiceOutwardById,
    getGovtRiceOutwardList,
    getGovtRiceOutwardSummary,
    updateGovtRiceOutwardEntry,
    deleteGovtRiceOutwardEntry,
    bulkDeleteGovtRiceOutwardEntries,
} from '../services/govt-rice-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createGovtRiceOutward = async (req, res, next) => {
    try {
        const entry = await createGovtRiceOutwardEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Govt rice outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtRiceOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getGovtRiceOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Govt rice outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtRiceOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            riceType,
            lotNo,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getGovtRiceOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            riceType,
            lotNo,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { data: result.data, pagination: result.pagination },
                'Govt rice outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtRiceOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getGovtRiceOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Govt rice outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateGovtRiceOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateGovtRiceOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Govt rice outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGovtRiceOutwardHandler = async (req, res, next) => {
    try {
        await deleteGovtRiceOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Govt rice outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteGovtRiceOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteGovtRiceOutwardEntries(
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
