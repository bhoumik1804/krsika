import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') })

/**
 * Application configuration
 * All environment variables are loaded and validated here
 */
const config = {
    // Server configuration
    server: {
        env: process.env.NODE_ENV,
        port: parseInt(process.env.PORT, 10),
        apiVersion: process.env.API_VERSION,
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production',
        isTest: process.env.NODE_ENV === 'test',
    },

    // Database configuration
    database: {
        uri:
            process.env.NODE_ENV === 'test'
                ? process.env.MONGODB_TEST_URI
                : process.env.MONGODB_URI,
        options: {
            // Mongoose 7.x options
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        },
    },

    // JWT configuration
    jwt: {
        accessToken: {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
        refreshToken: {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        },
    },

    // CORS configuration
    cors: {
        origin: process.env.CLIENT_URL.split(',').map((url) => url.trim()),
        credentials: true,
    },

    // Rate limiting configuration
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
    },

    // File upload configuration
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10),
        uploadDir: process.env.UPLOAD_DIR,
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL,
        dir: process.env.LOG_DIR,
    },

    // Socket.io configuration
    socket: {
        corsOrigin: process.env.CLIENT_URL.split(',').map((url) => url.trim()),
    },

    // Pagination configuration
    pagination: {
        defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10),
        maxPageSize: parseInt(process.env.MAX_PAGE_SIZE, 10),
    },

    // Email configuration (temporarily disabled)
    // email: {
    //     smtp: {
    //         host: process.env.SMTP_HOST,
    //         port: parseInt(process.env.SMTP_PORT, 10),
    //         user: process.env.SMTP_USER,
    //         password: process.env.SMTP_PASSWORD,
    //     },
    //     from: process.env.EMAIL_FROM,
    // },

    // Google OAuth configuration
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
    },
}

/**
 * Validate required environment variables
 */
const validateConfig = () => {
    // Accept either MONGODB_URI or MONGO_URI
    const hasMongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

    if (config.server.isProduction) {
        const required = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET']
        const missing = required.filter((key) => !process.env[key])

        if (!hasMongoUri) {
            missing.unshift('MONGODB_URI (or MONGO_URI)')
        }

        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}`
            )
        }
    } else if (!hasMongoUri) {
        console.warn(
            'WARNING: No MongoDB URI provided, using default: mongodb://localhost:27017/ricemill'
        )
    }

    // Validate JWT secrets are different
    if (config.jwt.accessToken.secret === config.jwt.refreshToken.secret) {
        console.warn(
            'WARNING: Access token and refresh token secrets should be different for better security!'
        )
    }

    // Validate JWT secrets length in production
    if (config.server.isProduction) {
        if (config.jwt.accessToken.secret.length < 32) {
            throw new Error(
                'ACCESS_TOKEN_SECRET must be at least 32 characters in production'
            )
        }
        if (config.jwt.refreshToken.secret.length < 32) {
            throw new Error(
                'REFRESH_TOKEN_SECRET must be at least 32 characters in production'
            )
        }
    }
}

// Validate configuration on import
if (!config.server.isTest) {
    validateConfig()
}

export default config
