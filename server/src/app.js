import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import env from './config/env.js'
import passport from './config/passport.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'
import logger from './utils/logger.js'

const app = express()

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

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Krsika API running successfully!' })
})

// 404 handler
app.use(notFoundHandler)

// Error handler (must be last)
app.use(errorHandler)

export default app
