import rateLimit from 'express-rate-limit'
import config from '../../config/index.js'
import ApiError from '../utils/api-error.js'

/**
 * General rate limiter
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, // Disable IPv6 validation warning
    handler: (req, res) => {
        throw ApiError.tooManyRequests(
            'Too many requests, please try again later'
        )
    },
})

/**
 * Strict rate limiter for auth endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true, // Don't count successful requests
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, // Disable IPv6 validation warning
    handler: (req, res) => {
        throw ApiError.tooManyRequests(
            'Too many authentication attempts, please try again later'
        )
    },
})

/**
 * API rate limiter
 * 1000 requests per hour per user
 */
export const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000,
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise use IP
        // Return a consistent string key
        if (req.user?.id) {
            return `user_${req.user.id}`
        }
        // Normalize IP address for consistent rate limiting
        const ip = req.ip || req.connection?.remoteAddress || 'unknown'
        return `ip_${ip.replace(/[^a-zA-Z0-9.:]/g, '_')}`
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: false, // Disable all validations to avoid IPv6 warning
    handler: (req, res) => {
        throw ApiError.tooManyRequests(
            'API rate limit exceeded, please try again later'
        )
    },
})

/**
 * Create custom rate limiter
 * @param {Number} windowMs - Time window in milliseconds
 * @param {Number} max - Maximum number of requests
 * @param {String} message - Error message
 */
export const createLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            throw ApiError.tooManyRequests(message || 'Too many requests')
        },
    })
}

export default {
    generalLimiter,
    authLimiter,
    apiLimiter,
    createLimiter,
}
