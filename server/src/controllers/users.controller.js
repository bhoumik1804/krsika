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
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Users Controller (Super Admin)
 */

export const createUser = async (req, res, next) => {
    try {
        const user = await createUserEntry(req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { user }, 'User created successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const getUserByIdHandler = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id)
        res.status(200).json(
            new ApiResponse(200, { user }, 'User retrieved successfully')
        )
    } catch (error) {
        next(error)
    }
}

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
        res.status(200).json(
            new ApiResponse(
                200,
                { data: result.data, pagination: result.pagination },
                'Users list retrieved'
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getUsersSummaryHandler = async (req, res, next) => {
    try {
        const summary = await getUsersSummary()
        res.status(200).json(
            new ApiResponse(200, { summary }, 'Users summary retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const updateUserHandler = async (req, res, next) => {
    try {
        const user = await updateUserEntry(
            req.params.id,
            req.body,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(200, { user }, 'User updated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const inviteUserHandler = async (req, res, next) => {
    try {
        const user = await inviteUserEntry(req.body, req.user._id)
        res.status(201).json(
            new ApiResponse(201, { user }, 'Invitation sent successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const suspendUserHandler = async (req, res, next) => {
    try {
        const user = await suspendUserEntry(req.params.id, req.user._id)
        res.status(200).json(
            new ApiResponse(200, { user }, 'User suspended successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const reactivateUserHandler = async (req, res, next) => {
    try {
        const user = await reactivateUserEntry(req.params.id, req.user._id)
        res.status(200).json(
            new ApiResponse(200, { user }, 'User reactivated successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const deleteUserHandler = async (req, res, next) => {
    try {
        await deleteUserEntry(req.params.id, req.user._id)
        res.status(200).json(
            new ApiResponse(200, null, 'User deleted successfully')
        )
    } catch (error) {
        next(error)
    }
}

export const bulkDeleteUsersHandler = async (req, res, next) => {
    try {
        const deletedCount = await bulkDeleteUserEntries(
            req.body.ids,
            req.user._id
        )
        res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount },
                `${deletedCount} users deleted`
            )
        )
    } catch (error) {
        next(error)
    }
}
