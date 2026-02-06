import {
    createLabourOtherEntry,
    getLabourOtherById,
    getLabourOtherList,
    getLabourOtherSummary,
    updateLabourOtherEntry,
    deleteLabourOtherEntry,
    bulkDeleteLabourOtherEntries,
} from '../services/labour-other.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const createLabourOther = async (req, res, next) => {
    try {
        const entry = await createLabourOtherEntry(
            req.params.millId,
            req.body,
            req.user._id
        )
        res.status(201).json(
            new ApiResponse(201, { entry }, 'Labour other created')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourOtherByIdHandler = async (req, res, next) => {
    try {
        const entry = await getLabourOtherById(req.params.millId, req.params.id)
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour other retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourOtherListHandler = async (req, res, next) => {
    try {
        const { page, limit, search, sortBy, sortOrder } = req.query
        const result = await getLabourOtherList(req.params.millId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            sortBy,
            sortOrder,
        })
        res.status(200).json(
            new ApiResponse(
                200,
                { entries: result.data, pagination: result.pagination },
                'Labour other list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getLabourOtherSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getLabourOtherSummary(req.params.millId)
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Labour other summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateLabourOtherHandler = async (req, res, next) => {
    try {
        const entry = await updateLabourOtherEntry(
            req.params.millId,
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { entry }, 'Labour other updated')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteLabourOtherHandler = async (req, res, next) => {
    try {
        await deleteLabourOtherEntry(req.params.millId, req.params.id)
        res.status(200).json(new ApiResponse(200, null, 'Labour other deleted'))
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteLabourOtherHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteLabourOtherEntries(
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
