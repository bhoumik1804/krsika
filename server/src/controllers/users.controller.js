import {
    createUserEntry,
    getUserById,
    getUsersList,
    getUsersSummary,
    updateUserEntry,
    inviteUserEntry,
    suspendUserEntry,
    reactivateUserEntry,
    deleteUserEntry,
    bulkDeleteUserEntries,
} from '../services/users.service.js'

/**
 * Users Controller (Super Admin)
 * HTTP request handlers for users endpoints
 */

/**
 * Create a new user
 * POST /api/admin/users
 */
export const createUser = async (req, res, next) => {
    try {
        const adminId = req.user._id

        const user = await createUserEntry(req.body, adminId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: user,
            message: 'User created successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get user by ID
 * GET /api/admin/users/:id
 */
export const getUserByIdHandler = async (req, res, next) => {
    try {
        const { id } = req.params

        const user = await getUserById(id)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'User retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get users list with pagination
 * GET /api/admin/users
 */
export const getUsersListHandler = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            search,
            role,
            isActive,
            millId,
            sortBy,
            sortOrder,
        } = req.query

        const result = await getUsersList({
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
            role,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            millId,
            sortBy,
            sortOrder,
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: result,
            message: 'Users list retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Get users summary statistics
 * GET /api/admin/users/summary
 */
export const getUsersSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getUsersSummary()

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: summary,
            message: 'Users summary retrieved successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Update a user
 * PUT /api/admin/users/:id
 */
export const updateUserHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const adminId = req.user._id

        const user = await updateUserEntry(id, req.body, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'User updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Invite a user via email
 * POST /api/admin/users/invite
 */
export const inviteUserHandler = async (req, res, next) => {
    try {
        const adminId = req.user._id

        const user = await inviteUserEntry(req.body, adminId)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: user,
            message: 'Invitation sent successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Suspend a user
 * PATCH /api/admin/users/:id/suspend
 */
export const suspendUserHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const adminId = req.user._id

        const user = await suspendUserEntry(id, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'User suspended successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Reactivate a suspended user
 * PATCH /api/admin/users/:id/reactivate
 */
export const reactivateUserHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const adminId = req.user._id

        const user = await reactivateUserEntry(id, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'User reactivated successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a user
 * DELETE /api/admin/users/:id
 */
export const deleteUserHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const adminId = req.user._id

        await deleteUserEntry(id, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'User deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Bulk delete users
 * DELETE /api/admin/users/bulk
 */
export const bulkDeleteUsersHandler = async (req, res, next) => {
    try {
        const { ids } = req.body
        const adminId = req.user._id

        const deletedCount = await bulkDeleteUserEntries(ids, adminId)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { deletedCount },
            message: `${deletedCount} users deleted successfully`,
        })
    } catch (error) {
        next(error)
    }
}
