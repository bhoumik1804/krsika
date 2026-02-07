import { z } from 'zod'

/**
 * Outward Balance Party Validators
 * Zod schemas for request validation
 */

// Common fields schema
const outwardBalancePartyBaseSchema = {
    partyName: z
        .string({
            required_error: 'Party name is required',
        })
        .trim()
        .min(1, 'Party name is required')
        .max(200, 'Party name is too long'),
    rice: z.number().min(0, 'Rice cannot be negative').optional(),
    gunny: z.number().min(0, 'Gunny cannot be negative').optional(),
    frk: z.number().min(0, 'FRK cannot be negative').optional(),
    other: z.number().min(0, 'Other cannot be negative').optional(),
    totalBalance: z
        .number()
        .min(0, 'Total balance cannot be negative')
        .optional(),
}

// Create outward balance party schema
export const createOutwardBalancePartySchema = z.object({
    body: z.object({
        ...outwardBalancePartyBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update outward balance party schema
export const updateOutwardBalancePartySchema = z.object({
    body: z.object({
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        rice: outwardBalancePartyBaseSchema.rice,
        gunny: outwardBalancePartyBaseSchema.gunny,
        frk: outwardBalancePartyBaseSchema.frk,
        other: outwardBalancePartyBaseSchema.other,
        totalBalance: outwardBalancePartyBaseSchema.totalBalance,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Outward balance party ID is required',
        }),
    }),
})

// Get outward balance party by ID schema
export const getOutwardBalancePartyByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Outward balance party ID is required',
        }),
    }),
})

// Delete outward balance party schema
export const deleteOutwardBalancePartySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Outward balance party ID is required',
        }),
    }),
})

// Bulk delete schema
export const bulkDeleteOutwardBalancePartySchema = z.object({
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
export const getOutwardBalancePartyListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['partyName', 'totalBalance', 'createdAt'])
            .default('partyName')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
    }),
})

// Summary query params schema
export const getOutwardBalancePartySummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
