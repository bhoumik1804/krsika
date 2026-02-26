import {
    createPaddySaleEntry,
    getPaddySaleList,
    getPaddySaleById,
    updatePaddySaleEntry,
    deletePaddySaleEntry,
    bulkDeletePaddySaleEntries,
    getPaddySaleSummary,
} from '../services/paddy-sale.service.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createPaddySale = asyncHandler(async (req, res) => {
    const { millId } = req.params
    const paddySale = await createPaddySaleEntry(millId, req.body)
    return res
        .status(201)
        .json(
            new ApiResponse(201, paddySale, 'Paddy sale created successfully')
        )
})

export const getPaddySaleListHandler = asyncHandler(async (req, res) => {
    const { millId } = req.params
    const result = await getPaddySaleList(millId, req.query)
    return res
        .status(200)
        .json(
            new ApiResponse(200, result, 'Paddy sale list fetched successfully')
        )
})

export const getPaddySaleByIdHandler = asyncHandler(async (req, res) => {
    const { millId, id } = req.params
    const paddySale = await getPaddySaleById(millId, id)
    if (!paddySale) {
        throw new ApiError(404, 'Paddy sale not found')
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, paddySale, 'Paddy sale fetched successfully')
        )
})

export const updatePaddySaleHandler = asyncHandler(async (req, res) => {
    const { millId, id } = req.params
    const paddySale = await updatePaddySaleEntry(millId, id, req.body)
    if (!paddySale) {
        throw new ApiError(404, 'Paddy sale not found')
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, paddySale, 'Paddy sale updated successfully')
        )
})

export const deletePaddySaleHandler = asyncHandler(async (req, res) => {
    const { millId, id } = req.params
    const paddySale = await deletePaddySaleEntry(millId, id)
    if (!paddySale) {
        throw new ApiError(404, 'Paddy sale not found')
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, paddySale, 'Paddy sale deleted successfully')
        )
})

export const bulkDeletePaddySaleHandler = asyncHandler(async (req, res) => {
    const { millId } = req.params
    const { ids } = req.body
    await bulkDeletePaddySaleEntries(millId, ids)
    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Paddy sales deleted successfully'))
})

export const getPaddySaleSummaryHandler = asyncHandler(async (req, res) => {
    const { millId } = req.params
    const { startDate, endDate } = req.query
    const summary = await getPaddySaleSummary(millId, startDate, endDate)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                summary,
                'Paddy sale summary fetched successfully'
            )
        )
})
