import { z } from 'zod'

/**
 * Gunny Purchase Validators
 * Zod schemas for request validation
 */

// Common fields schema
const gunnyPurchaseBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().min(1, 'Party name is required'),
    deliveryType: z.string().optional(),
    newGunnyQty: z.number().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
}

// Create gunny purchase schema
export const createGunnyPurchaseSchema = z.object({
    body: z.object({
        ...gunnyPurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update gunny purchase schema
export const updateGunnyPurchaseSchema = z.object({
    body: z.object({
        ...gunnyPurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Get gunny purchase by ID schema
export const getGunnyPurchaseByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Delete gunny purchase schema
export const deleteGunnyPurchaseSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteGunnyPurchaseSchema = z.object({
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
export const getGunnyPurchaseListSchema = z.object({
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
export const getGunnyPurchaseSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
