import { z } from 'zod'
import ApiError from '../utils/api-error.js'
import asyncHandler from '../utils/async-handler.js'

/**
 * Validate request using Zod schema
 * @param {Object} schema - Zod schema object with body, query, params
 * @returns {Function} Middleware function
 */
export const validateRequest = (schema) => {
    return asyncHandler(async (req, res, next) => {
        try {
            // Validate request body
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body)
            }

            // Validate query parameters
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query)
            }

            // Validate route parameters
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params)
            }

            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }))

                throw ApiError.validationError(errors, 'Validation failed')
            }

            throw error
        }
    })
}

export default validateRequest
