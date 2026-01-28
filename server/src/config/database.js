import config from './index.js'

/**
 * Database configuration for MongoDB
 */
export const databaseConfig = {
    uri: config.database.uri,
    options: {
        // Connection pool settings
        maxPoolSize: 10,
        minPoolSize: 2,

        // Timeout settings
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,

        // Network settings
        family: 4, // Use IPv4, skip trying IPv6

        // Retry settings
        retryWrites: true,
        retryReads: true,

        // Write concern
        w: 'majority',
        wtimeoutMS: 2500,

        // Read preference
        readPreference: 'primaryPreferred',

        // Compression
        compressors: ['zlib'],

        // Auto index
        autoIndex: config.server.isDevelopment, // Only in development
    },
}

/**
 * Get database name from URI
 */
export const getDatabaseName = () => {
    try {
        const url = new URL(config.database.uri)
        return url.pathname.slice(1) || 'ricemill'
    } catch (error) {
        return 'ricemill'
    }
}

export default databaseConfig
