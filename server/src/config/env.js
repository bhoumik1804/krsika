import dotenv from 'dotenv'
import { z } from 'zod'
import logger from '../utils/logger.js'

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.string().default('5000'),
    API_VERSION: z.string().default('v1'),

    // Database
    MONGODB_URI: z.string(),
    MONGODB_DATABASE_NAME: z.string(),
    MONGODB_TEST_DATABASE_NAME: z.string().optional(),

    // JWT
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRY: z.number().default(15 * 60 * 1000), // 15 minutes in milliseconds
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRY: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds

    // CORS
    CLIENT_URL: z.string(),
    ALLOWED_ORIGINS: z.string().optional(),

    // Google OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_REDIRECT_URI: z.string().optional(),

    // Logging
    LOG_LEVEL: z.string().default('info'),
    LOG_DIR: z.string().default('logs'),

    // Super Admin Seed
    SUPER_ADMIN_1_NAME: z.string().optional(),
    SUPER_ADMIN_1_EMAIL: z.string().optional(),
    SUPER_ADMIN_1_PASSWORD: z.string().optional(),
    SUPER_ADMIN_1_PHONE: z.string().optional(),
    SUPER_ADMIN_2_NAME: z.string().optional(),
    SUPER_ADMIN_2_EMAIL: z.string().optional(),
    SUPER_ADMIN_2_PASSWORD: z.string().optional(),
    SUPER_ADMIN_2_PHONE: z.string().optional(),
})

let env

try {
    env = envSchema.parse(process.env)
} catch (error) {
    logger.error('Environment validation failed:', error)
    process.exit(1)
}

export default env
