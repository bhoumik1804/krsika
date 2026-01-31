import passport from 'passport'
import {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    clearCookieOptions,
} from '../config/cookie.js'
import env from '../config/env.js'
import {
    loginUser,
    getUserById,
    updateUserProfile,
    changeUserPassword,
    refreshAccessToken,
    logoutUser,
    generateUserTokens,
    registerNewMill,
} from '../services/auth.service.js'
import logger from '../utils/logger.js'

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const userAgent = req.get('user-agent')
        const ipAddress = req.ip

        const { user, accessToken, refreshToken } = await loginUser(
            email,
            password,
            userAgent,
            ipAddress
        )
        // Set cookies
        res.cookie('accessToken', accessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'Login successful',
        })
    } catch (error) {
        next(error)
    }
}

export const googleAuth = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })(req, res, next)
}

export const googleCallback = (req, res, next) => {
    passport.authenticate(
        'google',
        { session: false },
        async (err, user, info) => {
            try {
                if (err) {
                    logger.error('Google authentication error:', err)
                    return res.redirect(`${env.CLIENT_URL}/auth/google-error`)
                }

                if (!user) {
                    logger.warn('Google auth failed: no user returned', {
                        info,
                    })
                    return res.redirect(`${env.CLIENT_URL}/auth/google-error`)
                }

                // Generate tokens
                const { accessToken, refreshToken } =
                    await generateUserTokens(user)

                // Set cookies
                res.cookie('accessToken', accessToken, accessTokenCookieOptions)
                res.cookie(
                    'refreshToken',
                    refreshToken,
                    refreshTokenCookieOptions
                )

                // Redirect to client
                res.redirect(`${env.CLIENT_URL}/auth-success`)
            } catch (error) {
                logger.error('Google callback error:', error)
                res.redirect(`${env.CLIENT_URL}/google-auth-error`)
            }
        }
    )(req, res, next)
}

export const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken

        if (!token) {
            const error = new Error('Refresh token not found')
            error.statusCode = 401
            throw error
        }

        const { accessToken, refreshToken, user } =
            await refreshAccessToken(token)

        // Set new cookies
        res.cookie('accessToken', accessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { user },
            message: 'Token refreshed',
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        await logoutUser(req.user._id)

        // Clear cookies
        res.clearCookie('accessToken', clearCookieOptions)
        res.clearCookie('refreshToken', {
            ...clearCookieOptions,
            path: '/api/auth/refresh',
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Logout successful',
        })
    } catch (error) {
        next(error)
    }
}

export const getMe = async (req, res, next) => {
    try {
        const user = await getUserById(req.user._id)
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'Success',
        })
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const user = await updateUserProfile(req.user._id, req.body)
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: user,
            message: 'Profile updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body

        await changeUserPassword(req.user._id, currentPassword, newPassword)

        // Revoke all tokens, user needs to login again
        res.clearCookie('accessToken', clearCookieOptions)
        res.clearCookie('refreshToken', {
            ...clearCookieOptions,
            path: '/api/auth/refresh',
        })

        res.status(200).json({
            success: true,
            statusCode: 200,
            data: null,
            message: 'Password changed successfully. Please login again.',
        })
    } catch (error) {
        next(error)
    }
}

export const registerMill = async (req, res, next) => {
    try {
        const mill = await registerNewMill(req.body, req.user._id)

        res.status(201).json({
            success: true,
            statusCode: 201,
            data: mill,
            message:
                'Mill registration successful. Please wait for verification.',
        })
    } catch (error) {
        next(error)
    }
}
