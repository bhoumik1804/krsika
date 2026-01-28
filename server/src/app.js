import express from 'express'
import passport from 'passport'
import config from './config/index.js'
import configurePassport from './config/passport.js'
import v1Routes from './routes/v1/index.js'
import { errorHandler } from './shared/middlewares/error-handler.js'
import { notFound } from './shared/middlewares/not-found.js'
import { generalLimiter } from './shared/middlewares/rate-limiter.js'
import {
    helmetConfig,
    corsConfig,
    mongoSanitizeConfig,
} from './shared/middlewares/security.js'
import logger from './shared/utils/logger.js'

/**
 * Create Express application
 */
const createApp = () => {
    const app = express()

    // Trust proxy (for rate limiting by IP when behind reverse proxy)
    app.set('trust proxy', 1)

    // Security middleware
    app.use(helmetConfig)
    app.use(corsConfig)

    // Body parsers
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // MongoDB sanitization (prevent NoSQL injection)
    app.use(mongoSanitizeConfig)

    // Rate limiting
    if (config.server.isProduction) {
        app.use(generalLimiter)
    }

    // Passport initialization
    configurePassport()
    app.use(passport.initialize())

    // Request logging (development only)
    if (config.server.isDevelopment) {
        app.use((req, res, next) => {
            logger.http(`${req.method} ${req.url}`, {
                ip: req.ip,
                userAgent: req.get('user-agent'),
            })
            next()
        })
    }

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Rice Mill SaaS API',
            version: '1.0.0',
            environment: config.server.env,
            docs: '/api/docs',
        })
    })

    // API routes
    app.use('/api/v1', v1Routes)

    // 404 handler
    app.use(notFound)

    // Global error handler (must be last)
    app.use(errorHandler)

    return app
}

export default createApp
