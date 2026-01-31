import { z } from 'zod'

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

                const validationError = new Error('Validation failed')
                validationError.statusCode = 400
                validationError.details = details
                next(validationError)
            } else {
                next(error)
            }
        }
    }
}
