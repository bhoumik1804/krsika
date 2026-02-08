import {
    createGovtGunnyOutwardEntry,
    getGovtGunnyOutwardById,
    getGovtGunnyOutwardList,
    getGovtGunnyOutwardSummary,
    updateGovtGunnyOutwardEntry,
    deleteGovtGunnyOutwardEntry,
    bulkDeleteGovtGunnyOutwardEntries,
} from '../services/govt-gunny-outward.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createGovtGunnyOutward = async (req, res, next) => {
    try {
        const entry = await createGovtGunnyOutwardEntry(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Govt gunny outward created')
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtGunnyOutwardByIdHandler = async (req, res, next) => {
    try {
        const entry = await getGovtGunnyOutwardById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Govt gunny outward retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtGunnyOutwardListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            gunnyDmNumber,
            samitiSangrahan,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        } = req.query
        const result = await getGovtGunnyOutwardList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            gunnyDmNumber,
            samitiSangrahan,
            startDate,
            endDate,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Govt gunny outward list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGovtGunnyOutwardSummaryHandler = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query
        const summary = await getGovtGunnyOutwardSummary(req.params.millId, {
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { summary },
                'Govt gunny outward summary retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateGovtGunnyOutwardHandler = async (req, res, next) => {
    try {
        const entry = await updateGovtGunnyOutwardEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Govt gunny outward updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGovtGunnyOutwardHandler = async (req, res, next) => {
    try {
        await deleteGovtGunnyOutwardEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Govt gunny outward deleted')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteGovtGunnyOutwardHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteGovtGunnyOutwardEntries(
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
