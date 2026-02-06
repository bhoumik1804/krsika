import jwt from 'jsonwebtoken'
import { MILL_STATUS } from '../constants/mill.status.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import { createMillEntry } from './mills.service.js'

/**
 * Register a new user (Signup)
 */
export const signupUser = async (email, password, fullName) => {
    const existingUser = await User.findOne({ email })
    if (existingUser)
        throw new ApiError(409, 'User with this email already exists')

    const user = new User({
        email,
        password,
        fullName,
        role: ROLES.GUEST_USER,
        isActive: true,
    })
    await user.save()

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save()

    logger.info('User signup successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
    })

    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.refreshToken

    return { user: userResponse, accessToken, refreshToken }
}

/**
 * Authenticate user with email and password
 */
export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password')
    if (!user) throw new ApiError(401, 'Invalid email or password')
    if (!user.isActive) throw new ApiError(401, 'User account is inactive')

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(401, 'Invalid email or password')

    user.lastLogin = new Date()
    await user.save()

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save()

    logger.info('User login successful', {
        userId: user._id,
        email: user.email,
        role: user.role,
    })

    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.refreshToken

    return { user: userResponse, accessToken, refreshToken }
}

/**
 * Get user by ID with populated relationships
 */
export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found')
    return user
}

/**
 * Create or find user by Google OAuth
 */
export const findOrCreateGoogleUser = async (profile) => {
    let user = await User.findOne({ email: profile.emails[0].value })

    if (!user) {
        user = new User({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            role: ROLES.GUEST_USER,
            isActive: true,
        })
        await user.save()
        logger.info('New Google user created', {
            userId: user._id,
            email: user.email,
            role: user.role,
        })
    }

    return user
}

/**
 * Update user profile information
 */
export const updateUserProfile = async (userId, updates) => {
    const allowedUpdates = ['fullName', 'email']
    const filteredUpdates = {}
    Object.keys(updates).forEach((key) => {
        if (allowedUpdates.includes(key)) filteredUpdates[key] = updates[key]
    })

    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
        new: true,
        runValidators: true,
    }).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found')

    logger.info('User profile updated', {
        userId: user._id,
        email: user.email,
        updates: Object.keys(filteredUpdates),
    })
    return user
}

/**
 * Change user password
 */
export const changeUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId).select('+password')
    if (!user) throw new ApiError(404, 'User not found')

    const isPasswordValid = await user.isPasswordCorrect(currentPassword)
    if (!isPasswordValid)
        throw new ApiError(400, 'Current password is incorrect')

    user.password = newPassword
    await user.save()

    logger.info('User password changed', {
        userId: user._id,
        email: user.email,
    })
    return { success: true, message: 'Password changed successfully' }
}

/**
 * Verify user credentials and role
 */
export const verifyUserRole = async (userId, requiredRole) => {
    const user = await User.findById(userId)
    if (!user || !user.isActive) throw new ApiError(401, 'User not authorized')
    if (user.role !== requiredRole && user.role !== ROLES.SUPER_ADMIN)
        throw new ApiError(403, 'Insufficient permissions for this action')
    return user
}

/**
 * Check if user can manage a specific mill
 */
export const canManageMill = async (userId, millId) => {
    const user = await User.findById(userId)
    if (!user || !user.isActive) throw new ApiError(401, 'User not authorized')

    if (user.role === ROLES.SUPER_ADMIN) return true
    if (
        user.role === ROLES.MILL_ADMIN &&
        user.millId &&
        user.millId.toString() === millId.toString()
    )
        return true

    throw new ApiError(403, 'Not authorized to manage this mill')
}

/**
 * Check if user has specific module permission
 */
export const hasModulePermission = async (userId, moduleSlug, action) => {
    const user = await User.findById(userId)
    if (!user || !user.isActive) throw new ApiError(401, 'User not authorized')

    if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.MILL_ADMIN)
        return true

    if (user.role === ROLES.MILL_STAFF) {
        const modulePermission = user.permissions?.find(
            (p) => p.moduleSlug === moduleSlug
        )
        if (!modulePermission)
            throw new ApiError(403, `No access to ${moduleSlug} module`)
        if (!modulePermission.actions.includes(action))
            throw new ApiError(
                403,
                `No ${action} permission for ${moduleSlug} module`
            )
        return true
    }

    throw new ApiError(403, 'Insufficient permissions')
}

/**
 * Register new user (Super Admin only)
 */
export const registerNewUser = async (userData, createdBy) => {
    const {
        email,
        fullName,
        password,
        role = ROLES.GUEST_USER,
        millId,
    } = userData

    const existingUser = await User.findOne({ email })
    if (existingUser)
        throw new ApiError(409, 'User with this email already exists')

    const user = new User({
        email,
        fullName,
        password,
        role,
        millId: millId || null,
        isActive: true,
    })
    await user.save()

    logger.info('New user registered', {
        userId: user._id,
        email: user.email,
        role: user.role,
        createdBy,
    })

    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.refreshToken

    return userResponse
}

/**
 * Deactivate user account
 */
export const deactivateUser = async (userId, deactivatedBy) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
    ).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found')

    logger.info('User deactivated', {
        userId: user._id,
        email: user.email,
        deactivatedBy,
    })
    return user
}

/**
 * Update user role (Super Admin only)
 */
export const updateUserRole = async (userId, newRole, updatedBy) => {
    if (!Object.values(ROLES).includes(newRole))
        throw new ApiError(400, 'Invalid role specified')

    const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
    ).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found')

    logger.info('User role updated', {
        userId: user._id,
        email: user.email,
        newRole,
        updatedBy,
    })
    return user
}

/**
 * Update user permissions (Super Admin / Mill Admin only)
 */
export const updateUserPermissions = async (userId, permissions, updatedBy) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { permissions },
        { new: true, runValidators: true }
    ).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found')
    if (user.role !== ROLES.MILL_STAFF)
        throw new ApiError(400, 'Permissions can only be set for Mill Staff')

    logger.info('User permissions updated', {
        userId: user._id,
        email: user.email,
        permissionCount: permissions.length,
        updatedBy,
    })
    return user
}

/**
 * Generate User Tokens Helper
 */
export const generateUserTokens = async (user) => {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save()
    return { accessToken, refreshToken }
}

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decoded.id)

    if (!user || user.refreshToken !== refreshToken)
        throw new ApiError(401, 'Invalid refresh token')

    const accessToken = user.generateAccessToken()
    const newRefreshToken = user.generateRefreshToken()
    user.refreshToken = newRefreshToken
    await user.save()

    return { accessToken, refreshToken: newRefreshToken, user }
}

/**
 * Logout User
 */
export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
}

/**
 * Register new mill
 */
export const registerNewMill = async (data, userId) => {
    const millData = { ...data, millStatus: MILL_STATUS.PENDING_VERIFICATION }
    const mill = await createMillEntry(millData, userId)

    logger.info('mill registration successful', {
        millId: mill._id,
        email: mill.contact.email,
    })
    return mill
}
