import { z } from 'zod'

/**
 * FRK Purchase Validators
 * Zod schemas for request validation
 */

// Common fields schema
const frkPurchaseBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().min(1, 'Party name is required'),
    frkQty: z.number().optional(),
    frkRate: z.number().optional(),
    gst: z.number().optional(),
}

// Create FRK purchase schema
export const createFrkPurchaseSchema = z.object({
    body: z.object({
        ...frkPurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update FRK purchase schema
export const updateFrkPurchaseSchema = z.object({
    body: z.object({
        ...frkPurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Get FRK purchase by ID schema
export const getFrkPurchaseByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Delete FRK purchase schema
export const deleteFrkPurchaseSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFrkPurchaseSchema = z.object({
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
export const getFrkPurchaseListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['date', 'partyName', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getFrkPurchaseSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
