import config from './index.js'

/**
 * Authentication configuration
 * Includes JWT, session, and OAuth settings
 */
export const authConfig = {
    // JWT configuration
    jwt: {
        accessToken: {
            secret: config.jwt.accessToken.secret,
            expiresIn: config.jwt.accessToken.expiresIn,
            algorithm: 'HS256',
            issuer: 'ricemill-api',
            audience: 'ricemill-client',
        },
        refreshToken: {
            secret: config.jwt.refreshToken.secret,
            expiresIn: config.jwt.refreshToken.expiresIn,
            algorithm: 'HS256',
            issuer: 'ricemill-api',
            audience: 'ricemill-client',
        },
    },

    // Password policy
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        saltRounds: 10,
    },

    // Login attempts and lockout
    loginAttempts: {
        maxAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        resetAfter: 60 * 60 * 1000, // 1 hour
    },

    // Session configuration
    session: {
        name: 'ricemill.sid',
        secret: config.jwt.accessToken.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: config.server.isProduction, // HTTPS only in production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'strict',
        },
    },

    // Token refresh settings
    tokenRefresh: {
        enabled: true,
        refreshBeforeExpiry: 5 * 60 * 1000, // Refresh 5 minutes before expiry
    },

    // OAuth providers (optional - for future implementation)
    oauth: {
        google: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                process.env.GOOGLE_CALLBACK_URL ||
                '/api/v1/auth/google/callback',
        },
        github: {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL:
                process.env.GITHUB_CALLBACK_URL ||
                '/api/v1/auth/github/callback',
        },
    },

    // OTP configuration
    otp: {
        length: 6,
        expiresIn: 10 * 60 * 1000, // 10 minutes
        maxAttempts: 3,
        resendDelay: 60 * 1000, // 1 minute
    },

    // Allowed origins for CORS
    allowedOrigins: [
        config.cors.origin,
        'http://localhost:5173',
        'http://localhost:3000',
    ],
}

export default authConfig
