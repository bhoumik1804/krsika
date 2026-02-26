import { UseFormReturn } from 'react-hook-form'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

/**
 * Parses API error response and sets form errors if available.
 * Returns true if validation errors were handled, false otherwise.
 */
export const handleFormError = <TFieldValues extends Record<string, any>>(
    error: unknown,
    form: UseFormReturn<TFieldValues>
): boolean => {
    if (error instanceof AxiosError) {
        const errorResponse = error.response?.data
        console.log('DEBUG: handleFormError response:', errorResponse)
        const backendError = errorResponse?.error || errorResponse

        // 1. Handle "errors" array (Common in backend ValidationError)
        // Format: { errors: [{ field: "email", message: "Invalid email" }] }
        const errors = backendError?.errors

        if (Array.isArray(errors) && errors.length > 0) {
            let hasSetError = false
            errors.forEach((err: any) => {
                if (err.field && err.message) {
                    form.setError(err.field, {
                        type: 'server',
                        message: err.message,
                    })
                    hasSetError = true
                }
            })

            if (hasSetError) {
                toast.error('Please fix the errors in the form.')
                return true
            }
        }

        // 2. Fallback: Handle "details" object
        // Format: { details: { fieldName: ["Error message"] } }
        const details = backendError?.details

        if (details && typeof details === 'object' && !Array.isArray(details)) {
            let hasSetError = false
            Object.entries(details).forEach(([key, messages]) => {
                const message = Array.isArray(messages) ? messages[0] : (messages as string)
                form.setError(key as any, {
                    type: 'server',
                    message: message,
                })
                hasSetError = true
            })

            if (hasSetError) {
                toast.error('Please fix the errors in the form.')
                return true
            }
        }
    }
    return false
}
