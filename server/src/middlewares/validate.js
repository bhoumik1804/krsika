import { z } from 'zod'
import ApiError from '../utils/ApiError.js'

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }))

                next(
                    ApiError.badRequest(
                        'Validation failed',
                        'VALIDATION_ERROR',
                        details
                    )
                )
            } else {
                next(error)
            }
        }
    }
}
