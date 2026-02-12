import { z } from 'zod'
import logger from '../utils/logger.js'

export const validate = (schema) => {
    // 1. Guard Clause: Check if schema exists when the middleware is initialized
    if (!schema) {
        throw new Error('Schema is required for validate middleware')
    }

    return async (req, res, next) => {
        try {
            // 2. Optimization: Use parseAsync if you have custom async refinements
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                // 3. Clean mapping of error messages
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }))

                logger.warn('Validation error', {
                    path: req.originalUrl,
                    method: req.method,
                    details,
                })

                // 4. Send a structured response immediately or pass to error handler
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Validation failed',
                    errors: details,
                })
            }

            // Handle unexpected non-Zod errors
            logger.error('Unexpected error in validation middleware', {
                error: error.message,
            })
            next(error)
        }
    }
}
