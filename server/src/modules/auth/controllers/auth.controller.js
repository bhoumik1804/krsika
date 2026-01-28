import { User } from '../../../shared/models/index.js'
import ApiError from '../../../shared/utils/api-error.js'
import ApiResponse from '../../../shared/utils/api-response.js'
import asyncHandler from '../../../shared/utils/async-handler.js'
import logger from '../../../shared/utils/logger.js'
import tokenService from '../services/token.service.js'

/**
 * Auth Controller
 * Handles authentication and authorization endpoints
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { email, password, name, phone, millId } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
        throw ApiError.conflict('User with this email already exists')
    }

    // Create user
    const user = await User.create({
        email: email.toLowerCase(),
        password,
        name,
        phone,
        millId: millId || null,
    })

    logger.info(`New user registered: ${user.email}`)

    return ApiResponse.created(
        res,
        user.toPublicJSON(),
        'User registered successfully'
    )
})

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    // User is attached to req by local strategy middleware
    const user = req.user

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user)
    const refreshToken = await tokenService.generateRefreshToken(
        user,
        req.headers['user-agent'],
        req.ip,
        req.headers['user-agent']
    )

    // Log successful login
    logger.info(`User logged in: ${user.email}`, {
        userId: user._id,
        ip: req.ip,
    })

    return ApiResponse.success(
        res,
        {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                millId: user.millId,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        },
        'Login successful'
    )
})

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken: token } = req.body

    // Verify refresh token
    const storedToken = await tokenService.verifyRefreshToken(token)

    if (!storedToken) {
        throw ApiError.unauthorized('Invalid or expired refresh token')
    }

    const user = storedToken.userId

    // Generate new access token
    const accessToken = tokenService.generateAccessToken(user)

    // Optionally rotate refresh token (recommended for security)
    const newRefreshToken = await tokenService.rotateRefreshToken(
        token,
        user,
        req.headers['user-agent'],
        req.ip,
        req.headers['user-agent']
    )

    logger.debug(`Tokens refreshed for user: ${user.email}`)

    return ApiResponse.success(
        res,
        {
            accessToken,
            refreshToken: newRefreshToken,
        },
        'Tokens refreshed successfully'
    )
})

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body

    if (refreshToken) {
        await tokenService.revokeRefreshToken(refreshToken)
    }

    logger.info(`User logged out: ${req.user.email}`)

    return ApiResponse.success(res, null, 'Logout successful')
})

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
export const logoutAll = asyncHandler(async (req, res) => {
    const revokedCount = await tokenService.revokeAllUserTokens(req.user.id)

    logger.info(`User logged out from all devices: ${req.user.email}`, {
        revokedCount,
    })

    return ApiResponse.success(
        res,
        { revokedCount },
        'Logged out from all devices'
    )
})

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate(
        'millId',
        'name code status'
    )

    if (!user) {
        throw ApiError.notFound('User not found')
    }

    return ApiResponse.success(
        res,
        user.toPublicJSON(),
        'Profile retrieved successfully'
    )
})

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, avatar } = req.body

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone, avatar },
        { new: true, runValidators: true }
    )

    if (!user) {
        throw ApiError.notFound('User not found')
    }

    logger.info(`Profile updated: ${user.email}`)

    return ApiResponse.success(
        res,
        user.toPublicJSON(),
        'Profile updated successfully'
    )
})

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
        throw ApiError.notFound('User not found')
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
        throw ApiError.unauthorized('Current password is incorrect')
    }

    // Update password
    user.password = newPassword
    await user.save()

    // Revoke all refresh tokens
    await tokenService.revokeAllUserTokens(user._id)

    logger.info(`Password changed: ${user.email}`)

    return ApiResponse.success(
        res,
        null,
        'Password changed successfully. Please login again.'
    )
})

/**
 * @route   GET /api/v1/auth/sessions
 * @desc    Get active sessions
 * @access  Private
 */
export const getSessions = asyncHandler(async (req, res) => {
    const sessions = await tokenService.getUserSessions(req.user.id)

    return ApiResponse.success(res, sessions, 'Sessions retrieved successfully')
})

export default {
    register,
    login,
    refreshAccessToken,
    logout,
    logoutAll,
    getProfile,
    updateProfile,
    changePassword,
    getSessions,
}
