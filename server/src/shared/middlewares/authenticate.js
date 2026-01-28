import passport from 'passport'
import ApiError from '../utils/api-error.js'
import asyncHandler from '../utils/async-handler.js'

/**
 * Authenticate user using JWT access token
 * Middleware to protect routes
 */
export const authenticate = asyncHandler(async (req, res, next) => {
    passport.authenticate(
        'jwt-access',
        { session: false },
        (err, user, info) => {
            if (err) {
                return next(err)
            }

            if (!user) {
                const message = info?.message || 'Unauthorized access'
                throw ApiError.unauthorized(message)
            }

            // Attach user to request
            req.user = user
            next()
        }
    )(req, res, next)
})

/**
 * Authenticate using local strategy (email/password)
 */
export const authenticateLocal = asyncHandler(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            const message = info?.message || 'Invalid credentials'
            throw ApiError.unauthorized(message)
        }

        // Attach user to request
        req.user = user
        next()
    })(req, res, next)
})

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't fail if token is missing
 */
export const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt-access', { session: false }, (err, user) => {
        if (!err && user) {
            req.user = user
        }
        next()
    })(req, res, next)
}

export default {
    authenticate,
    authenticateLocal,
    optionalAuth,
}
