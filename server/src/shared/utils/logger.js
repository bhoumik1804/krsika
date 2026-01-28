import path from 'path'
import { fileURLToPath } from 'url'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import config from '../../config/index.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
}

winston.addColors(colors)

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
)

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info
        let msg = `${timestamp} [${level}]: ${message}`

        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta, null, 2)}`
        }

        return msg
    })
)

// Create logs directory path
const logsDir = path.join(__dirname, '../../../', config.logging.dir)

// Define transports
const transports = []

// Console transport (always enabled)
transports.push(
    new winston.transports.Console({
        format: config.server.isDevelopment ? consoleFormat : logFormat,
    })
)

// File transports (only in non-test environments)
if (!config.server.isTest) {
    // Error logs - daily rotation
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            format: logFormat,
        })
    )

    // Combined logs - daily rotation
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: logFormat,
        })
    )

    // HTTP logs - daily rotation
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'http-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'http',
            maxSize: '20m',
            maxFiles: '7d',
            format: logFormat,
        })
    )
}

// Create logger instance
const logger = winston.createLogger({
    level: config.logging.level,
    levels,
    format: logFormat,
    transports,
    exitOnError: false,
})

// Stream for Morgan HTTP logger
logger.stream = {
    write: (message) => {
        logger.http(message.trim())
    },
}

/**
 * Log request details
 */
export const logRequest = (req) => {
    logger.http(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id,
    })
}

/**
 * Log error with context
 */
export const logError = (error, context = {}) => {
    logger.error(error.message, {
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode,
        ...context,
    })
}

/**
 * Log database query
 */
export const logQuery = (query, params = {}) => {
    if (config.server.isDevelopment) {
        logger.debug(`Database Query: ${query}`, params)
    }
}

/**
 * Log authentication events
 */
export const logAuth = (event, userId, details = {}) => {
    logger.info(`Auth: ${event}`, {
        userId,
        timestamp: new Date().toISOString(),
        ...details,
    })
}

/**
 * Log business events
 */
export const logBusiness = (event, data = {}) => {
    logger.info(`Business: ${event}`, {
        timestamp: new Date().toISOString(),
        ...data,
    })
}

export default logger
