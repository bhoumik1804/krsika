import passport from 'passport'
import {
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
    clearCookieOptions,
} from '../config/cookie.js'
import { refreshAccessToken } from '../services/auth.service.js'

/**
 * Attempts to refresh the access token using a refresh token
 * @param {string} refreshToken - The refresh token from cookies
 * @param {object} res - Express response object for setting cookies
 * @returns {Promise<object>} The refreshed user if successful
 * @throws {Error} If refresh token is invalid or expired
 */
const attemptTokenRefresh = async (refreshToken, res) => {
    const {
        accessToken,
        refreshToken: newRefreshToken,
        user: refreshedUser,
    } = await refreshAccessToken(refreshToken)

    // Set new cookies with appropriate options
    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)

    return refreshedUser
}

export const authenticate = async (req, res, next) => {
    passport.authenticate(
        'jwt',
        { session: false },
        async (err, user, info) => {
            if (err) {
                return next(err)
            }

            // JWT authentication successful
            if (user) {
                req.user = user
                return next()
            }

            // JWT auth failed, try to refresh the token
            const refreshToken = req.cookies?.refreshToken

            if (!refreshToken) {
                const error = new Error('Authentication required')
                error.statusCode = 401
                return next(error)
            }

            try {
                req.user = await attemptTokenRefresh(refreshToken, res)
                next()
            } catch (error) {
                // Refresh token is invalid or expired, clear both cookies
                res.clearCookie('accessToken', clearCookieOptions)
                res.clearCookie('refreshToken', clearCookieOptions)

                const authError = new Error('Authentication required')
                authError.statusCode = 401
                next(authError)
            }
        }
    )(req, res, next)
}

export const optionalAuthenticate = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err) {
            return next(err)
        }

        // JWT authentication successful
        if (user) {
            req.user = user
            return next()
        }

        // JWT auth failed, try to refresh the token if available
        const refreshToken = req.cookies?.refreshToken

        if (!refreshToken) {
            // No refresh token available, continue without authentication
            return next()
        }

        try {
            req.user = await attemptTokenRefresh(refreshToken, res)
        } catch (error) {
            // Refresh token is invalid or expired, clear both cookies but continue
            res.clearCookie('accessToken', clearCookieOptions)
            res.clearCookie('refreshToken', clearCookieOptions)
        }

        // Continue regardless of refresh result (optional auth)
        next()
    })(req, res, next)
}
