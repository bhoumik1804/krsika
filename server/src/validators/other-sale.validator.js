import { z } from 'zod'

/**
 * Other Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const otherSaleBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().min(1, 'Party name is required'),
    brokerName: z.string().optional(),
    otherSaleName: z.string().optional(),
    otherSaleQty: z.number().optional(),
    qtyType: z.string().optional(),
    rate: z.number().optional(),
    discountPercent: z.number().optional(),
    gst: z.number().optional(),
}

// Create other sale schema
export const createOtherSaleSchema = z.object({
    body: z.object({
        ...otherSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update other sale schema
export const updateOtherSaleSchema = z.object({
    body: z.object({
        ...otherSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other sale ID is required' }),
    }),
})

// Get other sale by ID schema
export const getOtherSaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other sale ID is required' }),
    }),
})

// Delete other sale schema
export const deleteOtherSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteOtherSaleSchema = z.object({
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
export const getOtherSaleListSchema = z.object({
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
export const getOtherSaleSummarySchema = z.object({
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
