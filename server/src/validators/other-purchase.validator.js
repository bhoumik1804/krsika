import { z } from 'zod'

/**
 * Other Purchase Validators
 * Zod schemas for request validation
 */

// Common fields schema
const otherPurchaseBaseSchema = {
    date: z.string(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    otherPurchaseName: z
        .string()
        .trim()
        .max(200, 'Other purchase name is too long')
        .optional(),
    otherPurchaseQty: z
        .number()
        .min(0, 'Quantity cannot be negative')
        .optional(),
    qtyType: z.string().trim().max(50, 'Quantity type is too long').optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    discountPercent: z
        .number()
        .min(0, 'Discount percent cannot be negative')
        .max(100, 'Discount percent cannot exceed 100')
        .optional(),
    gst: z
        .number()
        .min(0, 'GST cannot be negative')
        .max(100, 'GST cannot exceed 100')
        .optional(),
}

// Create other purchase schema
export const createOtherPurchaseSchema = z.object({
    body: z.object({
        ...otherPurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update other purchase schema
export const updateOtherPurchaseSchema = z.object({
    body: z.object({
        date: otherPurchaseBaseSchema.date.optional(),
        partyName: otherPurchaseBaseSchema.partyName,
        brokerName: otherPurchaseBaseSchema.brokerName,
        otherPurchaseName: otherPurchaseBaseSchema.otherPurchaseName,
        otherPurchaseQty: otherPurchaseBaseSchema.otherPurchaseQty,
        qtyType: otherPurchaseBaseSchema.qtyType,
        rate: otherPurchaseBaseSchema.rate,
        discountPercent: otherPurchaseBaseSchema.discountPercent,
        gst: otherPurchaseBaseSchema.gst,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other purchase ID is required' }),
    }),
})

// Get other purchase by ID schema
export const getOtherPurchaseByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other purchase ID is required' }),
    }),
})

// Delete other purchase schema
export const deleteOtherPurchaseSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other purchase ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteOtherPurchaseSchema = z.object({
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
export const getOtherPurchaseListSchema = z.object({
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
            .enum(['date', 'partyName', 'otherPurchaseName', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getOtherPurchaseSummarySchema = z.object({
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
