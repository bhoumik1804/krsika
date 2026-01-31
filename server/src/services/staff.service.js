import mongoose from 'mongoose'
import { Staff } from '../models/staff.model.js'
import logger from '../utils/logger.js'

/**
 * Staff Service
 * Business logic for staff operations
 */

/**
 * Create a new staff member
 * @param {string} millId - Mill ID
 * @param {object} data - Staff data
 * @param {string} userId - User ID who created the entry
 * @returns {Promise<object>} Created staff member
 */
export const createStaffEntry = async (millId, data, userId) => {
    try {
        // Check if email already exists for this mill
        const existingStaff = await Staff.findOne({
            millId,
            email: data.email.toLowerCase(),
        })

        if (existingStaff) {
            const error = new Error(
                'A staff member with this email already exists'
            )
            error.statusCode = 409
            throw error
        }

        const staff = new Staff({
            ...data,
            millId,
            createdBy: userId,
        })

        await staff.save()

        logger.info('Staff member created', {
            id: staff._id,
            millId,
            userId,
        })

        return staff
    } catch (error) {
        logger.error('Failed to create staff member', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff member by ID
 * @param {string} millId - Mill ID
 * @param {string} id - Staff ID
 * @returns {Promise<object>} Staff member
 */
export const getStaffById = async (millId, id) => {
    try {
        const staff = await Staff.findOne({
            _id: id,
            millId,
        })
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        return staff
    } catch (error) {
        logger.error('Failed to get staff member', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff list with pagination and filters
 * @param {string} millId - Mill ID
 * @param {object} options - Query options
 * @returns {Promise<object>} Paginated staff list
 */
export const getStaffList = async (millId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            role,
            isPaymentDone,
            isMillVerified,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options

        // Build match stage
        const matchStage = { millId: new mongoose.Types.ObjectId(millId) }

        if (status) {
            matchStage.status = status
        }

        if (role) {
            matchStage.role = role
        }

        if (typeof isPaymentDone === 'boolean') {
            matchStage.isPaymentDone = isPaymentDone
        }

        if (typeof isMillVerified === 'boolean') {
            matchStage.isMillVerified = isMillVerified
        }

        if (search) {
            matchStage.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
            ]
        }

        // Build sort
        const sortStage = {}
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Build aggregation pipeline
        const aggregate = Staff.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdByUser',
                    pipeline: [{ $project: { fullName: 1, email: 1 } }],
                },
            },
            {
                $unwind: {
                    path: '$createdByUser',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    fullName: { $concat: ['$firstName', ' ', '$lastName'] },
                },
            },
        ])

        // Use aggregatePaginate for pagination
        const result = await Staff.aggregatePaginate(aggregate, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            customLabels: {
                docs: 'data',
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
            data: result.data,
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
    } catch (error) {
        logger.error('Failed to get staff list', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get staff summary statistics
 * @param {string} millId - Mill ID
 * @returns {Promise<object>} Summary statistics
 */
export const getStaffSummary = async (millId) => {
    try {
        const [summary] = await Staff.aggregate([
            { $match: { millId: { $toObjectId: millId } } },
            {
                $group: {
                    _id: null,
                    totalStaff: { $sum: 1 },
                    activeCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
                        },
                    },
                    inactiveCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0],
                        },
                    },
                    suspendedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0],
                        },
                    },
                    managerCount: {
                        $sum: {
                            $cond: [{ $eq: ['$role', 'manager'] }, 1, 0],
                        },
                    },
                    supervisorCount: {
                        $sum: {
                            $cond: [{ $eq: ['$role', 'supervisor'] }, 1, 0],
                        },
                    },
                    operatorCount: {
                        $sum: {
                            $cond: [{ $eq: ['$role', 'operator'] }, 1, 0],
                        },
                    },
                    accountantCount: {
                        $sum: {
                            $cond: [{ $eq: ['$role', 'accountant'] }, 1, 0],
                        },
                    },
                    paymentPendingCount: {
                        $sum: {
                            $cond: [{ $eq: ['$isPaymentDone', false] }, 1, 0],
                        },
                    },
                    verifiedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$isMillVerified', true] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalStaff: 1,
                    statusCounts: {
                        active: '$activeCount',
                        inactive: '$inactiveCount',
                        suspended: '$suspendedCount',
                    },
                    roleCounts: {
                        manager: '$managerCount',
                        supervisor: '$supervisorCount',
                        operator: '$operatorCount',
                        accountant: '$accountantCount',
                    },
                    paymentPendingCount: 1,
                    verifiedCount: 1,
                },
            },
        ])

        return (
            summary || {
                totalStaff: 0,
                statusCounts: {
                    active: 0,
                    inactive: 0,
                    suspended: 0,
                },
                roleCounts: {
                    manager: 0,
                    supervisor: 0,
                    operator: 0,
                    accountant: 0,
                },
                paymentPendingCount: 0,
                verifiedCount: 0,
            }
        )
    } catch (error) {
        logger.error('Failed to get staff summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update a staff member
 * @param {string} millId - Mill ID
 * @param {string} id - Staff ID
 * @param {object} data - Update data
 * @param {string} userId - User ID who updated the entry
 * @returns {Promise<object>} Updated staff member
 */
export const updateStaffEntry = async (millId, id, data, userId) => {
    try {
        // If email is being updated, check for duplicates
        if (data.email) {
            const existingStaff = await Staff.findOne({
                millId,
                email: data.email.toLowerCase(),
                _id: { $ne: id },
            })

            if (existingStaff) {
                const error = new Error(
                    'A staff member with this email already exists'
                )
                error.statusCode = 409
                throw error
            }
        }

        const updateData = {
            ...data,
            updatedBy: userId,
        }

        const staff = await Staff.findOneAndUpdate(
            { _id: id, millId },
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'fullName email')
            .populate('updatedBy', 'fullName email')

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Staff member updated', {
            id,
            millId,
            userId,
        })

        return staff
    } catch (error) {
        logger.error('Failed to update staff member', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Delete a staff member
 * @param {string} millId - Mill ID
 * @param {string} id - Staff ID
 * @returns {Promise<void>}
 */
export const deleteStaffEntry = async (millId, id) => {
    try {
        const staff = await Staff.findOneAndDelete({
            _id: id,
            millId,
        })

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        logger.info('Staff member deleted', {
            id,
            millId,
        })
    } catch (error) {
        logger.error('Failed to delete staff member', {
            millId,
            id,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk delete staff members
 * @param {string} millId - Mill ID
 * @param {string[]} ids - Array of staff IDs
 * @returns {Promise<number>} Number of deleted entries
 */
export const bulkDeleteStaffEntries = async (millId, ids) => {
    try {
        const result = await Staff.deleteMany({
            _id: { $in: ids },
            millId,
        })

        logger.info('Staff members bulk deleted', {
            millId,
            count: result.deletedCount,
        })

        return result.deletedCount
    } catch (error) {
        logger.error('Failed to bulk delete staff members', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Mark attendance for a staff member
 * @param {string} millId - Mill ID
 * @param {string} staffId - Staff ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} status - Attendance status (P, A, H)
 * @returns {Promise<object>} Updated staff member
 */
export const markStaffAttendance = async (millId, staffId, date, status) => {
    try {
        const attendanceDate = new Date(date)
        attendanceDate.setUTCHours(0, 0, 0, 0)

        // Check if attendance already exists for this date
        const staff = await Staff.findOne({
            _id: staffId,
            millId,
        })

        if (!staff) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        // Find existing attendance for the date
        const existingIndex = staff.attendanceHistory.findIndex(
            (record) => record.date.toISOString().split('T')[0] === date
        )

        if (existingIndex >= 0) {
            // Update existing attendance
            staff.attendanceHistory[existingIndex].status = status
        } else {
            // Add new attendance record
            staff.attendanceHistory.push({
                date: attendanceDate,
                status,
            })
        }

        await staff.save()

        logger.info('Staff attendance marked', {
            staffId,
            millId,
            date,
            status,
        })

        return staff
    } catch (error) {
        logger.error('Failed to mark staff attendance', {
            millId,
            staffId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Bulk mark attendance for multiple staff members
 * Uses bulk write operations to minimize database round trips
 * @param {string} millId - Mill ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {Array<{staffId: string, status: string}>} attendanceRecords - Attendance records
 * @returns {Promise<{success: number, failed: number}>} Result
 */
export const bulkMarkStaffAttendance = async (
    millId,
    date,
    attendanceRecords
) => {
    try {
        const attendanceDate = new Date(date)
        attendanceDate.setUTCHours(0, 0, 0, 0)

        // Extract all staff IDs from the records
        const staffIds = attendanceRecords.map((record) => record.staffId)

        // First, verify which staff members exist in this mill (single query)
        const existingStaff = await Staff.find(
            { _id: { $in: staffIds }, millId },
            { _id: 1 }
        ).lean()

        const existingStaffIds = new Set(
            existingStaff.map((s) => s._id.toString())
        )

        // Build bulk write operations
        const bulkOps = []
        let failed = 0

        for (const record of attendanceRecords) {
            if (!existingStaffIds.has(record.staffId)) {
                failed++
                continue
            }

            // Use array filters to update existing or add new attendance record
            // First, try to update existing attendance for this date
            bulkOps.push({
                updateOne: {
                    filter: {
                        _id: record.staffId,
                        millId,
                        'attendanceHistory.date': attendanceDate,
                    },
                    update: {
                        $set: { 'attendanceHistory.$.status': record.status },
                    },
                },
            })

            // Then, add new attendance if it doesn't exist
            bulkOps.push({
                updateOne: {
                    filter: {
                        _id: record.staffId,
                        millId,
                        'attendanceHistory.date': { $ne: attendanceDate },
                    },
                    update: {
                        $push: {
                            attendanceHistory: {
                                date: attendanceDate,
                                status: record.status,
                            },
                        },
                    },
                },
            })
        }

        // Execute bulk write operation (single database call)
        const successCount = existingStaffIds.size
        if (bulkOps.length > 0) {
            await Staff.bulkWrite(bulkOps, { ordered: false })
        }

        logger.info('Bulk staff attendance marked', {
            millId,
            date,
            success: successCount,
            failed,
        })

        return { success: successCount, failed }
    } catch (error) {
        logger.error('Failed to bulk mark staff attendance', {
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get attendance summary for a staff member
 * Uses MongoDB aggregation pipeline for efficient database-level filtering
 * @param {string} millId - Mill ID
 * @param {string} staffId - Staff ID
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<object>} Attendance summary
 */
export const getStaffAttendanceSummary = async (
    millId,
    staffId,
    month,
    year
) => {
    try {
        // Calculate date range for the month
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0, 23, 59, 59, 999)
        const totalDays = endDate.getDate()

        // Use aggregation pipeline to filter attendance at database level
        const [result] = await Staff.aggregate([
            {
                $match: {
                    _id: { $toObjectId: staffId },
                    millId: { $toObjectId: millId },
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    fullName: { $concat: ['$firstName', ' ', '$lastName'] },
                    // Filter attendance history at database level
                    filteredAttendance: {
                        $filter: {
                            input: '$attendanceHistory',
                            as: 'record',
                            cond: {
                                $and: [
                                    { $gte: ['$$record.date', startDate] },
                                    { $lte: ['$$record.date', endDate] },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    fullName: 1,
                    filteredAttendance: 1,
                    presentDays: {
                        $size: {
                            $filter: {
                                input: '$filteredAttendance',
                                as: 'r',
                                cond: { $eq: ['$$r.status', 'P'] },
                            },
                        },
                    },
                    absentDays: {
                        $size: {
                            $filter: {
                                input: '$filteredAttendance',
                                as: 'r',
                                cond: { $eq: ['$$r.status', 'A'] },
                            },
                        },
                    },
                    holidayDays: {
                        $size: {
                            $filter: {
                                input: '$filteredAttendance',
                                as: 'r',
                                cond: { $eq: ['$$r.status', 'H'] },
                            },
                        },
                    },
                },
            },
        ])

        if (!result) {
            const error = new Error('Staff member not found')
            error.statusCode = 404
            throw error
        }

        const { presentDays, absentDays, holidayDays } = result
        const workingDays = totalDays - holidayDays
        const attendancePercentage =
            workingDays > 0
                ? Math.round((presentDays / workingDays) * 100 * 100) / 100
                : 0

        return {
            staffId: result._id,
            staffName: result.fullName,
            month,
            year,
            totalDays,
            presentDays,
            absentDays,
            holidayDays,
            attendancePercentage: isNaN(attendancePercentage)
                ? 0
                : attendancePercentage,
            attendanceRecords: result.filteredAttendance.map((r) => ({
                date: r.date.toISOString().split('T')[0],
                status: r.status,
            })),
        }
    } catch (error) {
        logger.error('Failed to get staff attendance summary', {
            millId,
            staffId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Get bulk attendance summary for all staff
 * Uses MongoDB aggregation pipeline for efficient database-level processing
 * @param {string} millId - Mill ID
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<object>} Bulk attendance summary
 */
export const getBulkAttendanceSummary = async (millId, month, year) => {
    try {
        // Calculate date range for the month
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0, 23, 59, 59, 999)
        const totalDays = endDate.getDate()

        // Use aggregation pipeline to process all staff at database level
        const staffSummaries = await Staff.aggregate([
            {
                $match: {
                    millId: { $toObjectId: millId },
                    status: 'active',
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    fullName: { $concat: ['$firstName', ' ', '$lastName'] },
                    // Filter attendance history at database level
                    filteredAttendance: {
                        $filter: {
                            input: '$attendanceHistory',
                            as: 'record',
                            cond: {
                                $and: [
                                    { $gte: ['$$record.date', startDate] },
                                    { $lte: ['$$record.date', endDate] },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    fullName: 1,
                    filteredAttendance: 1,
                    presentDays: {
                        $size: {
                            $filter: {
                                input: '$filteredAttendance',
                                as: 'r',
                                cond: { $eq: ['$$r.status', 'P'] },
                            },
                        },
                    },
                    absentDays: {
                        $size: {
                            $filter: {
                                input: '$filteredAttendance',
                                as: 'r',
                                cond: { $eq: ['$$r.status', 'A'] },
                            },
                        },
                    },
                    holidayDays: {
                        $size: {
                            $filter: {
                                input: '$filteredAttendance',
                                as: 'r',
                                cond: { $eq: ['$$r.status', 'H'] },
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    staffId: '$_id',
                    staffName: '$fullName',
                    month: month,
                    year: year,
                    totalDays: totalDays,
                    attendancePercentage: {
                        $cond: {
                            if: {
                                $gt: [
                                    { $subtract: [totalDays, '$holidayDays'] },
                                    0,
                                ],
                            },
                            then: {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    '$presentDays',
                                                    {
                                                        $subtract: [
                                                            totalDays,
                                                            '$holidayDays',
                                                        ],
                                                    },
                                                ],
                                            },
                                            100,
                                        ],
                                    },
                                    2,
                                ],
                            },
                            else: 0,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    staffId: 1,
                    staffName: 1,
                    month: 1,
                    year: 1,
                    totalDays: 1,
                    presentDays: 1,
                    absentDays: 1,
                    holidayDays: 1,
                    attendancePercentage: 1,
                    attendanceRecords: {
                        $map: {
                            input: '$filteredAttendance',
                            as: 'r',
                            in: {
                                date: {
                                    $dateToString: {
                                        format: '%Y-%m-%d',
                                        date: '$$r.date',
                                    },
                                },
                                status: '$$r.status',
                            },
                        },
                    },
                },
            },
        ])

        return {
            month,
            year,
            staffSummaries,
        }
    } catch (error) {
        logger.error('Failed to get bulk attendance summary', {
            millId,
            error: error.message,
        })
        throw error
    }
}
