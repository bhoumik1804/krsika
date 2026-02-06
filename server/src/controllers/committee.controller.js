import {
    createCommitteeEntry,
    getCommitteeById,
    getCommitteeList,
    getCommitteeSummary,
    updateCommitteeEntry,
    deleteCommitteeEntry,
    bulkDeleteCommitteeEntries,
} from '../services/committee.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createCommittee = async (req, res, next) => {
    try {
        const committee = await createCommitteeEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { committee },
                'Committee created successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getCommitteeByIdHandler = async (req, res, next) => {
    try {
        const committee = await getCommitteeById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { committee },
                'Committee retrieved successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getCommitteeListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getCommitteeList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { committees: result.data, pagination: result.pagination },
                'Committee list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getCommitteeSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getCommitteeSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Committee summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateCommitteeHandler = async (req, res, next) => {
    try {
        const committee = await updateCommitteeEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { committee },
                'Committee updated successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteCommitteeHandler = async (req, res, next) => {
    try {
        await deleteCommitteeEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Committee deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteCommitteeHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteCommitteeEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} committees deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
