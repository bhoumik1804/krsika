import { z } from 'zod'

/**
 * Rice Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const riceSaleBaseSchema = {
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    deliveryType: z.string().optional(),
    lotOrOther: z.string().optional(),
    fciOrNAN: z.string().optional(),
    riceType: z.string().optional(),
    riceQty: z.number().optional(),
    riceRatePerQuintal: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
    gunnyType: z.string().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
    frkType: z.string().optional(),
    frkRatePerQuintal: z.number().optional(),
    lotNumber: z.string().optional(),
}

// Create rice sale schema
export const createRiceSaleSchema = z.object({
    body: z.object({
        ...riceSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update rice sale schema
export const updateRiceSaleSchema = z.object({
    body: z.object({
        ...riceSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice sale ID is required' }),
    }),
})

// Get rice sale by ID schema
export const getRiceSaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice sale ID is required' }),
    }),
})

// Delete rice sale schema
export const deleteRiceSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteRiceSaleSchema = z.object({
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
export const listRiceSaleSchema = z.object({
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
export const summaryRiceSaleSchema = z.object({
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
