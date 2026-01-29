import fs from 'fs'
import path from 'path'
import winston from 'winston'

const logDir = process.env.LOG_DIR
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
}

// 1. Define the Console Format (Matches your requirement)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => {
        return `[${level}]: ${message}`
    })
)

// 2. Define the File Format (More detailed with timestamp and stack)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json() // JSON is better for log analysis files
)

const logger = winston.createLogger({
    level: 'info', // Global minimum level
    transports: [
        // Console Transport: logs info, warn, and error
        new winston.transports.Console({
            format: consoleFormat,
        }),

        // File Transport: logs ONLY error level and above
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error', // <--- This restricts this file to errors only
            format: fileFormat,
            maxsize: 10 * 1024 * 1024,
            maxFiles: 5,
        }),
    ],
    // Handle crashes and rejections in the error log
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log'),
        }),
    ],
})

export default logger
