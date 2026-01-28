/**
 * Mill Validators
 * ================
 * Zod schemas for mill validation
 */
import { z } from 'zod'

/**
 * Create mill schema
 */
export const createMillSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, 'Mill name must be at least 2 characters')
            .max(100, 'Mill name must be less than 100 characters'),
        code: z
            .string()
            .min(3, 'Mill code must be at least 3 characters')
            .max(10, 'Mill code must be at most 10 characters')
            .regex(/^[A-Za-z0-9]+$/, 'Mill code must be alphanumeric'),
        address: z.string().min(5, 'Address must be at least 5 characters'),
        city: z.string().min(2, 'City must be at least 2 characters'),
        state: z.string().min(2, 'State must be at least 2 characters'),
        pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
        phone: z.string().min(10, 'Phone must be at least 10 digits'),
        email: z.string().email('Invalid email address').optional(),
        gstNumber: z
            .string()
            .regex(
                /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                'Invalid GST number format'
            )
            .optional(),
        panNumber: z
            .string()
            .regex(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN number format')
            .optional(),
        logo: z.string().url('Invalid logo URL').optional(),
    }),
})

/**
 * Update mill schema
 */
export const updateMillSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, 'Mill name must be at least 2 characters')
            .max(100, 'Mill name must be less than 100 characters')
            .optional(),
        code: z
            .string()
            .min(3, 'Mill code must be at least 3 characters')
            .max(10, 'Mill code must be at most 10 characters')
            .regex(/^[A-Za-z0-9]+$/, 'Mill code must be alphanumeric')
            .optional(),
        address: z
            .string()
            .min(5, 'Address must be at least 5 characters')
            .optional(),
        city: z
            .string()
            .min(2, 'City must be at least 2 characters')
            .optional(),
        state: z
            .string()
            .min(2, 'State must be at least 2 characters')
            .optional(),
        pincode: z
            .string()
            .regex(/^\d{6}$/, 'Pincode must be 6 digits')
            .optional(),
        phone: z
            .string()
            .min(10, 'Phone must be at least 10 digits')
            .optional(),
        email: z.string().email('Invalid email address').optional(),
        gstNumber: z
            .string()
            .regex(
                /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                'Invalid GST number format'
            )
            .optional()
            .nullable(),
        panNumber: z
            .string()
            .regex(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN number format')
            .optional()
            .nullable(),
        logo: z.string().url('Invalid logo URL').optional().nullable(),
    }),
})

/**
 * Update mill status schema
 */
export const updateMillStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'], {
            errorMap: () => ({ message: 'Invalid mill status' }),
        }),
    }),
})

/**
 * Update mill settings schema
 */
export const updateMillSettingsSchema = z.object({
    body: z.record(z.any()),
})

/**
 * Mill ID param schema
 */
export const millIdParamSchema = z.object({
    params: z.object({
        millId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mill ID'),
    }),
})

/**
 * Query params for listing mills
 */
export const listMillsQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1).optional(),
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(10)
            .optional(),
        sortBy: z
            .enum(['name', 'code', 'city', 'createdAt', 'status'])
            .default('createdAt')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
        search: z.string().optional(),
        status: z
            .enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'])
            .optional(),
    }),
})

export default {
    createMillSchema,
    updateMillSchema,
    updateMillStatusSchema,
    updateMillSettingsSchema,
    millIdParamSchema,
    listMillsQuerySchema,
}
