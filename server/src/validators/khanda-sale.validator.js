import { z } from 'zod'

/**
 * Khanda Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const khandaSaleBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    khandaQty: z.number().optional(),
    khandaRate: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
}

// Create khanda sale schema
export const createKhandaSaleSchema = z.object({
    body: z.object({
        ...khandaSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update khanda sale schema
export const updateKhandaSaleSchema = z.object({
    body: z.object({
        ...khandaSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Khanda sale ID is required' }),
    }),
})

// Get khanda sale by ID schema
export const getKhandaSaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Khanda sale ID is required' }),
    }),
})

// Delete khanda sale schema
export const deleteKhandaSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Khanda sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteKhandaSaleSchema = z.object({
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
export const listKhandaSaleSchema = z.object({
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
export const summaryKhandaSaleSchema = z.object({
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
