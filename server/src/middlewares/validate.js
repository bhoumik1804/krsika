import { z } from 'zod'
import logger from '../utils/logger.js'

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const data = {
                body: req.body,
                query: req.query,
                params: req.params,
            }

            // Debug logging
            console.log('=== VALIDATION DEBUG ===')
            console.log('Path:', req.path)
            console.log('Method:', req.method)
            console.log('Data to validate:', JSON.stringify(data, null, 2))

            schema.parse(data)
            console.log('Validation passed!')
            next()
        } catch (error) {
            console.log('=== VALIDATION ERROR ===')
            console.log('Error type:', error.constructor.name)
            console.log('Error message:', error.message)

            if (error instanceof z.ZodError) {
                console.log(
                    'Zod errors:',
                    JSON.stringify(error.errors, null, 2)
                )

                const details = (error.errors || []).map((err) => ({
                    field: err.path.join('.') || 'root',
                    message: err.message,
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
                logger.error('Non-Zod error in validate middleware', {
                    path: req.path,
                    method: req.method,
                    error: error.message,
                })
                next(error)
            }
        }
    }
}
