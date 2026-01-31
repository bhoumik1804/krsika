import { z } from 'zod'

/**
 * Rice Purchase Validators
 * Zod schemas for request validation
 */

// Common fields schema
const ricePurchaseBaseSchema = {
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
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    riceGunny: z.number().min(0, 'Rice gunny cannot be negative').optional(),
    netWeight: z.number().min(0, 'Net weight cannot be negative').optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    amount: z.number().min(0, 'Amount cannot be negative').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    brokerage: z.number().min(0, 'Brokerage cannot be negative').optional(),
}

// Create rice purchase schema
export const createRicePurchaseSchema = z.object({
    body: z.object({
        ...ricePurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update rice purchase schema
export const updateRicePurchaseSchema = z.object({
    body: z.object({
        date: ricePurchaseBaseSchema.date.optional(),
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        riceType: ricePurchaseBaseSchema.riceType,
        riceGunny: ricePurchaseBaseSchema.riceGunny,
        netWeight: ricePurchaseBaseSchema.netWeight,
        rate: ricePurchaseBaseSchema.rate,
        amount: ricePurchaseBaseSchema.amount,
        brokerName: ricePurchaseBaseSchema.brokerName,
        brokerage: ricePurchaseBaseSchema.brokerage,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice purchase ID is required' }),
    }),
})

// Get rice purchase by ID schema
export const getRicePurchaseByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice purchase ID is required' }),
    }),
})

// Delete rice purchase schema
export const deleteRicePurchaseSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice purchase ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteRicePurchaseSchema = z.object({
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
export const getRicePurchaseListSchema = z.object({
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
export const getRicePurchaseSummarySchema = z.object({
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
