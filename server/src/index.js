import createApp from './app.js'
import config from './config/index.js'
import { connectDatabase } from './shared/database/connection.js'
import logger from './shared/utils/logger.js'

/**
 * Start server
 */
const startServer = async () => {
    try {
        // Connect to database
        logger.info('Connecting to database...')
        await connectDatabase()

        // Create Express app
        const app = createApp()

        // Start listening
        const PORT = config.server.port
        const server = app.listen(PORT, () => {
            logger.info(
                `Server running in ${config.server.env} mode on port ${PORT}`
            )
            logger.info(`API v1: http://localhost:${PORT}/api/v1`)
            logger.info(`Health check: http://localhost:${PORT}/api/v1/health`)
        })

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`)

            server.close(async () => {
                logger.info('HTTP server closed')

                try {
                    // Close database connection
                    const { disconnectDatabase } =
                        await import('./shared/database/connection.js')
                    await disconnectDatabase()

                    logger.info('Graceful shutdown completed')
                    process.exit(0)
                } catch (error) {
                    logger.error('Error during graceful shutdown:', error)
                    process.exit(1)
                }
            })

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forcing shutdown due to timeout')
                process.exit(1)
            }, 10000)
        }

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        process.on('SIGINT', () => gracefulShutdown('SIGINT'))

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error)
            gracefulShutdown('uncaughtException')
        })

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
            gracefulShutdown('unhandledRejection')
        })
    } catch (error) {
        logger.error('Failed to start server:', error)
        process.exit(1)
    }
}

// Start the server
startServer()
