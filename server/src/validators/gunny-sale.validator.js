import { z } from 'zod'

/**
 * Gunny Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const gunnySaleBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().min(1, 'Party name is required'),
    newGunnyQty: z
        .number()
        .min(0, 'New gunny quantity cannot be negative')
        .optional(),
    newGunnyRate: z
        .number()
        .min(0, 'New gunny rate cannot be negative')
        .optional(),
    oldGunnyQty: z
        .number()
        .min(0, 'Old gunny quantity cannot be negative')
        .optional(),
    oldGunnyRate: z
        .number()
        .min(0, 'Old gunny rate cannot be negative')
        .optional(),
    plasticGunnyQty: z
        .number()
        .min(0, 'Plastic gunny quantity cannot be negative')
        .optional(),
    plasticGunnyRate: z
        .number()
        .min(0, 'Plastic gunny rate cannot be negative')
        .optional(),
}

// Create gunny sale schema
export const createGunnySaleSchema = z.object({
    body: z.object({
        ...gunnySaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update gunny sale schema
export const updateGunnySaleSchema = z.object({
    body: z.object({
        ...gunnySaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Gunny sale ID is required' }),
    }),
})

// Get gunny sale by ID schema
export const getGunnySaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Gunny sale ID is required' }),
    }),
})

// Delete gunny sale schema
export const deleteGunnySaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Gunny sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteGunnySaleSchema = z.object({
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
export const getGunnySaleListSchema = z.object({
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
export const getGunnySaleSummarySchema = z.object({
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
