import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const connectDB = async () => {
    try {
        const dbName =
            process.env.NODE_ENV === 'development'
                ? process.env.MONGODB_TEST_DATABASE_NAME
                : process.env.MONGODB_DATABASE_NAME

        const uri = process.env.MONGODB_URI

        await mongoose.connect(uri, {
            dbName: dbName,
        })

        logger.info(`MongoDB connected: ${dbName}`)

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected')
        })

        process.on('SIGINT', async () => {
            await mongoose.connection.close()
            logger.info('MongoDB connection closed through app termination')
            process.exit(0)
        })
    } catch (error) {
        logger.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}

export default connectDB
