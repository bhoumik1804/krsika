import { z } from 'zod'

/**
 * FRK Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const frkSaleBaseSchema = {
    date: z
        .string({
            required_error: 'Date is required',
        })
        .datetime({ offset: true })
        .or(
            z
                .string()
                .regex(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'Invalid date format (YYYY-MM-DD)'
                )
        ),
    partyName: z
        .string({
            required_error: 'Party name is required',
        })
        .trim()
        .min(1, 'Party name is required')
        .max(200, 'Party name is too long'),
    totalWeight: z
        .number()
        .min(0, 'Total weight cannot be negative')
        .optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    amount: z.number().min(0, 'Amount cannot be negative').optional(),
}

// Create FRK sale schema
export const createFrkSaleSchema = z.object({
    body: z.object({
        ...frkSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update FRK sale schema
export const updateFrkSaleSchema = z.object({
    body: z.object({
        date: frkSaleBaseSchema.date.optional(),
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        totalWeight: frkSaleBaseSchema.totalWeight,
        rate: frkSaleBaseSchema.rate,
        amount: frkSaleBaseSchema.amount,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK sale ID is required' }),
    }),
})

// Get FRK sale by ID schema
export const getFrkSaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK sale ID is required' }),
    }),
})

// Delete FRK sale schema
export const deleteFrkSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFrkSaleSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string(), { required_error: 'IDs array is required' })
            .min(1, 'At least one ID is required'),
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// List query params schema
export const getFrkSaleListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'partyName', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getFrkSaleSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
    }),
})
