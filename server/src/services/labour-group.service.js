import mongoose from 'mongoose'
import { LabourGroup } from '../models/labour-group.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'

export const createLabourGroupEntry = async (millId, data) => {
    const labourGroup = new LabourGroup({ ...data, millId })
    await labourGroup.save()
    logger.info('Labour group created', { id: labourGroup._id, millId })
    return labourGroup
}

export const getLabourGroupById = async (millId, id) => {
    const labourGroup = await LabourGroup.findOne({ _id: id, millId })

    if (!labourGroup) throw new ApiError(404, 'Labour group not found')
    return labourGroup
}

export const getLabourGroupList = async (millId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'labourTeamName',
        sortOrder = 'asc',
    } = options
    const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

    if (search) {
        matchStage.$or = [{ labourTeamName: { $regex: search, $options: 'i' } }]
    }

    const aggregate = LabourGroup.aggregate([
        { $match: matchStage },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
        {
            $addFields: {
                id: { $toString: '$_id' },
            },
        },
    ])

    const result = await LabourGroup.aggregatePaginate(aggregate, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        customLabels: {
            docs: 'reports',
            totalDocs: 'total',
            totalPages: 'totalPages',
            page: 'page',
            limit: 'limit',
            hasPrevPage: 'hasPrevPage',
            hasNextPage: 'hasNextPage',
            prevPage: 'prevPage',
            nextPage: 'nextPage',
        },
    })

    return {
        reports: result.reports, // Ensure consistency with other reports if needed, or keep as reports
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
        },
    }
}

export const getLabourGroupSummary = async (millId) => {
    const [summary] = await LabourGroup.aggregate([
        { $match: { millId: new mongoose.Types.ObjectId(millId) } },
        { $group: { _id: null, totalLabourGroups: { $sum: 1 } } },
        { $project: { _id: 0, totalLabourGroups: 1 } },
    ])
    return summary || { totalLabourGroups: 0 }
}

export const updateLabourGroupEntry = async (millId, id, data) => {
    const labourGroup = await LabourGroup.findOneAndUpdate(
        { _id: id, millId },
        { ...data },
        { new: true, runValidators: true }
    )

    if (!labourGroup) throw new ApiError(404, 'Labour group not found')
    logger.info('Labour group updated', { id, millId })
    return labourGroup
}

export const deleteLabourGroupEntry = async (millId, id) => {
    const labourGroup = await LabourGroup.findOneAndDelete({ _id: id, millId })
    if (!labourGroup) throw new ApiError(404, 'Labour group not found')
    logger.info('Labour group deleted', { id, millId })
}

export const bulkDeleteLabourGroupEntries = async (millId, ids) => {
    const result = await LabourGroup.deleteMany({ _id: { $in: ids }, millId })
    logger.info('Labour groups bulk deleted', {
        millId,
        count: result.deletedCount,
    })
    return result.deletedCount
}
