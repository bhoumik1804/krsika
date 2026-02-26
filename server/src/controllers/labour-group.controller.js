import {
    createLabourGroupEntry,
    getLabourGroupById,
    getLabourGroupList,
    getLabourGroupSummary,
    updateLabourGroupEntry,
    deleteLabourGroupEntry,
    bulkDeleteLabourGroupEntries,
} from '../services/labour-group.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createLabourGroup = async (req, res, next) => {
    try {
        const labourGroup = await createLabourGroupEntry(
            req.params.millId,
            req.body
        )
        res.status(201).json(
            new ApiResponse(
                201,
                { labourGroup },
                'Labour group created successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourGroupByIdHandler = async (req, res, next) => {
    try {
        const labourGroup = await getLabourGroupById(
            req.params.millId,
            req.params.id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { labourGroup },
                'Labour group retrieved successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourGroupListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getLabourGroupList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { labourGroups: result.reports, pagination: result.pagination },
                'Labour group list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourGroupSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getLabourGroupSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Labour group summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateLabourGroupHandler = async (req, res, next) => {
    try {
        const labourGroup = await updateLabourGroupEntry(
            req.params.millId,
            req.params.id,
            req.body
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { labourGroup },
                'Labour group updated successfully'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteLabourGroupHandler = async (req, res, next) => {
    try {
        await deleteLabourGroupEntry(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, null, 'Labour group deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteLabourGroupHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteLabourGroupEntries(
            req.params.millId,
            req.body.ids
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} labour groups deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
