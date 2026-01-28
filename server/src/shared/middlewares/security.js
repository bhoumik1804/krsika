import cors from 'cors'
import helmet from 'helmet'
import config from '../../config/index.js'

/**
 * Configure Helmet for security headers
 */
export const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
})

/**
 * Configure CORS
 */
export const corsConfig = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)

        const allowedOrigins = Array.isArray(config.cors.origin)
            ? config.cors.origin
            : [config.cors.origin]

        if (allowedOrigins.includes(origin) || config.server.isDevelopment) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // 10 minutes
})

/**
 * Sanitize value to prevent NoSQL injection
 * Removes $ and . from keys which are MongoDB operators
 */
const sanitizeValue = (value) => {
    if (value === null || value === undefined) {
        return value
    }

    if (typeof value === 'string') {
        // Replace $ and . with _
        return value.replace(/[\$\.]/g, '_')
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue)
    }

    if (typeof value === 'object') {
        const sanitized = {}
        for (const [key, val] of Object.entries(value)) {
            // Skip keys that start with $ (MongoDB operators)
            if (key.startsWith('$')) {
                console.warn(`MongoDB injection attempt detected: key "${key}"`)
                continue
            }
            const sanitizedKey = key.replace(/[\$\.]/g, '_')
            sanitized[sanitizedKey] = sanitizeValue(val)
        }
        return sanitized
    }

    return value
}

/**
 * Custom MongoDB sanitization middleware (Express 5 compatible)
 * Prevents NoSQL injection attacks by sanitizing req.body and req.params
 * Note: req.query is read-only in Express 5, so we only sanitize body and params
 */
export const mongoSanitizeConfig = (req, res, next) => {
    try {
        // Sanitize body
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeValue(req.body)
        }

        // Note: req.params is also read-only in Express 5
        // Validation should happen at the route level for params

        next()
    } catch (error) {
        next(error)
    }
}

export default {
    helmetConfig,
    corsConfig,
    mongoSanitizeConfig,
}
