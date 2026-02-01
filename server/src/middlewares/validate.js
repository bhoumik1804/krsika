import { z } from 'zod'
import logger from '../utils/logger.js'

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const data = {
                body: req.body || {},
                query: req.query || {},
                params: req.params || {},
            }

            schema.parse(data)
            next()
        } catch (error) {
            console.log('=== VALIDATION ERROR ===')
            console.log('Error type:', error.constructor.name)
            console.log('Error message:', error.message)
            console.log('Full error:', error)

            if (error instanceof z.ZodError) {
                console.log(
                    'Zod errors:',
                    JSON.stringify(error.errors, null, 2)
                )

                const details = (error.errors || []).map((err) => ({
                    field: err.path.join('.') || 'root',
                    message: err.message,
                    code: err.code,
                }))

                logger.warn('Validation error', {
                    path: req.path,
                    method: req.method,
                    details,
                })

                const validationError = new Error('Validation failed')
                validationError.statusCode = 400
                validationError.details = details
                next(validationError)
            } else {
                console.log('Non-Zod error details:', {
                    message: error.message,
                    stack: error.stack,
                    statusCode: error.statusCode,
                    details: error.details,
                })
                logger.error('Non-Zod error in validate middleware', {
                    path: req.path,
                    method: req.method,
                    error: error.message,
                    stack: error.stack,
                })
                next(error)
            }
        }
    }
}
