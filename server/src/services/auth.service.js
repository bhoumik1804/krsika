import jwt from 'jsonwebtoken'
import { MILL_STATUS } from '../constants/mill.status.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import logger from '../utils/logger.js'
import { createMillEntry } from './mills.service.js'

/**
 * Register a new user (Signup)
 * Used by: Signup endpoint for new users
 * Returns: User object with access and refresh tokens
 */
export const signupUser = async (
    fullName,
    email,
    password,
    userAgent,
    ipAddress
) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const error = new Error('User with this email already exists')
            error.statusCode = 409
            throw error
        }

        // Create new user with GUEST_USER role
        const user = new User({
            fullName,
            email,
            password,
            role: ROLES.GUEST_USER,
            isActive: true,
        })

        await user.save()

        // Generate tokens
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Save refresh token
        user.refreshToken = refreshToken
        await user.save()

        logger.info('User signup successful', {
            userId: user._id,
            email: user.email,
            role: user.role,
            ipAddress,
            userAgent,
        })

        // Return user without password
        const userResponse = user.toObject()
        delete userResponse.password
        delete userResponse.refreshToken

        return {
            user: userResponse,
            accessToken,
            refreshToken,
        }
    } catch (error) {
        logger.error('Signup failed', { email, error: error.message })
        throw error
    }
}

/**
 * Authenticate user with email and password
 * Used by: Login endpoint for all user roles
 * Returns: User object with access and refresh tokens
 */
export const loginUser = async (email, password, userAgent, ipAddress) => {
    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            throw new Error('Invalid email or password')
        }

        if (!user.isActive) {
            throw new Error('User account is inactive')
        }

        // Debug logging
        logger.debug('Login attempt:', {
            email,
            hasPassword: !!password,
            hasUserPassword: !!user.password,
            userId: user._id
        })

        if (!password) {
            throw new Error('Password is required')
        }

        if (!user.password) {
            throw new Error('User account has no password set. Please use alternative login method.')
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            throw new Error('Invalid email or password')
        }

        // Update last login
        user.lastLogin = new Date()
        await user.save()

        // Generate tokens
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Save refresh token
        user.refreshToken = refreshToken
        await user.save()

        logger.info('User login successful', {
            userId: user._id,
            email: user.email,
            role: user.role,
            ipAddress,
            userAgent,
        })

        // Return user without password
        const userResponse = user.toObject()
        delete userResponse.password
        delete userResponse.refreshToken

        return {
            user: userResponse,
            accessToken,
            refreshToken,
        }
    } catch (error) {
        logger.error('Login failed', { email, error: error.message })
        throw error
    }
}

/**
 * Get user by ID with populated relationships
 * Used by: Profile endpoint, authentication middleware
 */
export const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId).select(
            '-password -refreshToken'
        )

        if (!user) {
            throw new Error('User not found')
        }

        return user
    } catch (error) {
        logger.error('Failed to get user', { userId, error: error.message })
        throw error
    }
}

/**
 * Create or find user by Google OAuth
 * Used by: Google OAuth callback
 * Role assignment: GUEST_USER by default (can be upgraded by Super Admin)
 */
export const findOrCreateGoogleUser = async (profile) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value })

        if (!user) {
            // Create new user with GUEST_USER role
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
    } catch (error) {
        logger.error('Google user lookup/creation failed', {
            email: profile.emails[0].value,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update user profile information
 * Used by: Profile update endpoint
 * Allowed fields: fullName, email (if verification implemented)
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const allowedUpdates = ['fullName', 'email']
        const filteredUpdates = {}

        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key]
            }
        })

        const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
            new: true,
            runValidators: true,
        }).select('-password -refreshToken')

        if (!user) {
            throw new Error('User not found')
        }

        logger.info('User profile updated', {
            userId: user._id,
            email: user.email,
            updates: Object.keys(filteredUpdates),
        })

        return user
    } catch (error) {
        logger.error('Failed to update user profile', {
            userId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Change user password
 * Used by: Change password endpoint
 * Requires: Current password verification
 */
export const changeUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    try {
        const user = await User.findById(userId).select('+password')

        if (!user) {
            throw new Error('User not found')
        }

        // Verify current password
        const isPasswordValid = await user.isPasswordCorrect(currentPassword)
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect')
        }

        // Update password
        user.password = newPassword
        await user.save()

        logger.info('User password changed', {
            userId: user._id,
            email: user.email,
        })

        return { success: true, message: 'Password changed successfully' }
    } catch (error) {
        logger.error('Failed to change password', {
            userId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Verify user credentials and role
 * Used by: Role-based access control middleware
 * Returns: User with role and permissions
 */
export const verifyUserRole = async (userId, requiredRole) => {
    try {
        const user = await User.findById(userId)

        if (!user || !user.isActive) {
            throw new Error('User not authorized')
        }

        // Check if user has required role or is Super Admin
        if (user.role !== requiredRole && user.role !== ROLES.SUPER_ADMIN) {
            throw new Error('Insufficient permissions for this action')
        }

        return user
    } catch (error) {
        logger.error('Role verification failed', {
            userId,
            requiredRole,
            error: error.message,
        })
        throw error
    }
}

/**
 * Check if user can manage a specific mill
 * Used by: Mill operations endpoints
 * Validates: Mill Admin ownership or Super Admin access
 */
export const canManageMill = async (userId, millId) => {
    try {
        const user = await User.findById(userId)

        if (!user || !user.isActive) {
            throw new Error('User not authorized')
        }

        // Super Admin can manage any mill
        if (user.role === ROLES.SUPER_ADMIN) {
            return true
        }

        // Mill Admin can only manage their own mill
        if (
            user.role === ROLES.MILL_ADMIN &&
            user.millId &&
            user.millId.toString() === millId.toString()
        ) {
            return true
        }

        throw new Error('Not authorized to manage this mill')
    } catch (error) {
        logger.error('Mill management authorization check failed', {
            userId,
            millId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Check if user has specific module permission
 * Used by: Module access control
 * Validates: Staff permissions for specific modules
 */
export const hasModulePermission = async (userId, moduleSlug, action) => {
    try {
        const user = await User.findById(userId)

        if (!user || !user.isActive) {
            throw new Error('User not authorized')
        }

        // Super Admin has all permissions
        if (user.role === ROLES.SUPER_ADMIN) {
            return true
        }

        // Mill Admin has all permissions for their mill's modules
        if (user.role === ROLES.MILL_ADMIN) {
            return true
        }

        // Mill Staff - check permission array
        if (user.role === ROLES.MILL_STAFF) {
            const modulePermission = user.permissions?.find(
                (p) => p.moduleSlug === moduleSlug
            )

            if (!modulePermission) {
                throw new Error(`No access to ${moduleSlug} module`)
            }

            if (!modulePermission.actions.includes(action)) {
                throw new Error(
                    `No ${action} permission for ${moduleSlug} module`
                )
            }

            return true
        }

        throw new Error('Insufficient permissions')
    } catch (error) {
        logger.error('Permission check failed', {
            userId,
            moduleSlug,
            action,
            error: error.message,
        })
        throw error
    }
}

/**
 * Register new user (Super Admin only)
 * Used by: Admin user creation endpoint
 * Default role: GUEST_USER (can be set by Super Admin)
 */
export const registerNewUser = async (userData, createdBy) => {
    try {
        const {
            email,
            fullName,
            password,
            role = ROLES.GUEST_USER,
            millId,
        } = userData

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new Error('User with this email already exists')
        }

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
    } catch (error) {
        logger.error('User registration failed', {
            email: userData.email,
            error: error.message,
        })
        throw error
    }
}

/**
 * Deactivate user account
 * Used by: Admin user management endpoints
 * Side effect: Logs out all active sessions
 */
export const deactivateUser = async (userId, deactivatedBy) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        ).select('-password -refreshToken')

        if (!user) {
            throw new Error('User not found')
        }

        logger.info('User deactivated', {
            userId: user._id,
            email: user.email,
            deactivatedBy,
        })

        return user
    } catch (error) {
        logger.error('Failed to deactivate user', {
            userId,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update user role (Super Admin only)
 * Used by: Admin role management endpoint
 * Role hierarchy: SUPER_ADMIN > MILL_ADMIN > MILL_STAFF > GUEST_USER
 */
export const updateUserRole = async (userId, newRole, updatedBy) => {
    try {
        // Validate role
        if (!Object.values(ROLES).includes(newRole)) {
            throw new Error('Invalid role specified')
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true }
        ).select('-password -refreshToken')

        if (!user) {
            throw new Error('User not found')
        }

        logger.info('User role updated', {
            userId: user._id,
            email: user.email,
            newRole,
            updatedBy,
        })

        return user
    } catch (error) {
        logger.error('Failed to update user role', {
            userId,
            newRole,
            error: error.message,
        })
        throw error
    }
}

/**
 * Update user permissions (Super Admin / Mill Admin only)
 * Used by: Staff permissions management endpoint
 * Applies to: MILL_STAFF role only
 */
export const updateUserPermissions = async (userId, permissions, updatedBy) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { permissions },
            { new: true, runValidators: true }
        ).select('-password -refreshToken')

        if (!user) {
            throw new Error('User not found')
        }

        if (user.role !== ROLES.MILL_STAFF) {
            throw new Error('Permissions can only be set for Mill Staff')
        }

        logger.info('User permissions updated', {
            userId: user._id,
            email: user.email,
            permissionCount: permissions.length,
            updatedBy,
        })

        return user
    } catch (error) {
        logger.error('Failed to update user permissions', {
            userId,
            error: error.message,
        })
        throw error
    }
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
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decoded.id)

        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token')
        }

        const accessToken = user.generateAccessToken()
        const newRefreshToken = user.generateRefreshToken()

        user.refreshToken = newRefreshToken
        await user.save()

        return { accessToken, refreshToken: newRefreshToken, user }
    } catch (error) {
        throw new Error('Invalid refresh token')
    }
}

/**
 * Logout User
 */
export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
}

/**
 * Register new mill
 * Used by: Public registration endpoint
 * Status: PENDING_VERIFICATION
 */
export const registerNewMill = async (data, userId) => {
    try {
        // Force status to PENDING_VERIFICATION
        const millData = {
            ...data,
            millStatus: MILL_STATUS.PENDING_VERIFICATION,
        }

        const mill = await createMillEntry(millData, userId)

        logger.info('mill registration successful', {
            millId: mill._id,
            email: mill.contact.email,
        })

        return mill
    } catch (error) {
        logger.error('mill registration failed', {
            error: error.message,
        })
        throw error
    }
}
