import http from 'http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import connectDB from './config/db.js'
import env from './config/env.js'
import passport from './config/passport.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'
import logger from './utils/logger.js'

const app = express()

const PORT = env.PORT

// Security middleware
app.use(helmet())

// CORS configuration
const allowedOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',')
    : [env.CLIENT_URL]

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true)

            if (allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true, // Allow cookies
    })
)

// Body parser middleware
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Cookie parser
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})

app.use('/api', limiter)

// Passport initialization
app.use(passport.initialize())

// Request logging
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
    })
    next()
})

// API routes
app.use(`/api/${env.API_VERSION}`, routes)

app.all('/', (req, res) => {
    res.status(200).json({
        message: 'Krsika API running successfully!',
        success: true,
        method: req.method,
        timestamp: new Date().toISOString(),
    })
})

// 404 handler
app.use(notFoundHandler)

// Error handler (must be last)
app.use(errorHandler)

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB()

        app.listen(PORT, () => {
            logger.info(
                `Server running on port ${PORT} in ${env.NODE_ENV} mode`
            )
            logger.info(
                `API available at http://localhost:${PORT}/api/${env.API_VERSION}`
            )
        })
    } catch (error) {
        logger.error('Failed to start server:', error)
        process.exit(1)
    }
}



startServer()

export default app
