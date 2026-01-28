import mongoose from 'mongoose'
import { databaseConfig } from '../../config/database.js'
import config from '../../config/index.js'
import logger from '../utils/logger.js'

/**
 * MongoDB connection manager
 * Handles database connection with retry logic and event listeners
 */

let isConnected = false

/**
 * Connect to MongoDB
 */
export const connectDatabase = async () => {
    // If already connected, return
    if (isConnected) {
        logger.info('Using existing database connection')
        return
    }

    try {
        // Set mongoose options
        mongoose.set('strictQuery', false)

        // Connect to MongoDB
        const conn = await mongoose.connect(
            databaseConfig.uri,
            databaseConfig.options
        )

        isConnected = true
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
        logger.info(`Database: ${conn.connection.name}`)

        // Connection event listeners
        setupEventListeners()
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error)
        throw error
    }
}

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async () => {
    if (!isConnected) {
        return
    }

    try {
        await mongoose.disconnect()
        isConnected = false
        logger.info('MongoDB disconnected')
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error)
        throw error
    }
}

/**
 * Setup MongoDB event listeners
 */
const setupEventListeners = () => {
    const { connection } = mongoose

    // Connected
    connection.on('connected', () => {
        logger.info('Mongoose connected to MongoDB')
    })

    // Error
    connection.on('error', (error) => {
        logger.error('Mongoose connection error:', error)
    })

    // Disconnected
    connection.on('disconnected', () => {
        logger.warn('Mongoose disconnected from MongoDB')
        isConnected = false
    })

    // Reconnected
    connection.on('reconnected', () => {
        logger.info('Mongoose reconnected to MongoDB')
        isConnected = true
    })

    // SIGINT - graceful shutdown
    process.on('SIGINT', async () => {
        try {
            await connection.close()
            logger.info('Mongoose connection closed through app termination')
            process.exit(0)
        } catch (error) {
            logger.error('Error closing Mongoose connection:', error)
            process.exit(1)
        }
    })
}

/**
 * Get connection status
 */
export const getConnectionStatus = () => {
    return {
        isConnected,
        readyState: mongoose.connection.readyState,
        readyStateText: getReadyStateText(mongoose.connection.readyState),
    }
}

/**
 * Get human-readable connection state
 */
const getReadyStateText = (state) => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    }
    return states[state] || 'unknown'
}

/**
 * Check if database is healthy
 */
export const checkDatabaseHealth = async () => {
    try {
        if (!isConnected) {
            return { healthy: false, message: 'Database not connected' }
        }

        // Ping database
        await mongoose.connection.db.admin().ping()

        return {
            healthy: true,
            message: 'Database is healthy',
            status: getConnectionStatus(),
        }
    } catch (error) {
        logger.error('Database health check failed:', error)
        return {
            healthy: false,
            message: error.message,
            status: getConnectionStatus(),
        }
    }
}

/**
 * Drop database (use with caution - only for testing)
 */
export const dropDatabase = async () => {
    if (config.server.isProduction) {
        throw new Error('Cannot drop database in production')
    }

    try {
        await mongoose.connection.dropDatabase()
        logger.warn('Database dropped')
    } catch (error) {
        logger.error('Error dropping database:', error)
        throw error
    }
}

/**
 * Clear all collections (use with caution - only for testing)
 */
export const clearDatabase = async () => {
    if (config.server.isProduction) {
        throw new Error('Cannot clear database in production')
    }

    try {
        const collections = mongoose.connection.collections

        for (const key in collections) {
            const collection = collections[key]
            await collection.deleteMany({})
        }

        logger.warn('All collections cleared')
    } catch (error) {
        logger.error('Error clearing database:', error)
        throw error
    }
}

export default {
    connectDatabase,
    disconnectDatabase,
    getConnectionStatus,
    checkDatabaseHealth,
    dropDatabase,
    clearDatabase,
}
