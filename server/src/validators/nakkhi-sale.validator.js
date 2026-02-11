import { z } from 'zod'

/**
 * Nakkhi Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const nakkhiSaleBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    nakkhiQty: z.number().optional(),
    nakkhiRate: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
}

// Create nakkhi sale schema
export const createNakkhiSaleSchema = z.object({
    body: z.object({
        ...nakkhiSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update nakkhi sale schema
export const updateNakkhiSaleSchema = z.object({
    body: z.object({
        ...nakkhiSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Nakkhi sale ID is required' }),
    }),
})

// Get nakkhi sale by ID schema
export const getNakkhiSaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Nakkhi sale ID is required' }),
    }),
})

// Delete nakkhi sale schema
export const deleteNakkhiSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Nakkhi sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteNakkhiSaleSchema = z.object({
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
export const listNakkhiSaleSchema = z.object({
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
export const summaryNakkhiSaleSchema = z.object({
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
