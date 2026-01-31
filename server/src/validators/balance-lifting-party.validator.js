import { z } from 'zod'

/**
 * Balance Lifting Party Validators
 * Zod schemas for request validation
 */

// Common fields schema
const balanceLiftingPartyBaseSchema = {
    partyName: z
        .string({
            required_error: 'Party name is required',
        })
        .trim()
        .min(1, 'Party name is required')
        .max(200, 'Party name is too long'),
    paddy: z.number().min(0, 'Paddy cannot be negative').optional(),
    rice: z.number().min(0, 'Rice cannot be negative').optional(),
    gunny: z.number().min(0, 'Gunny cannot be negative').optional(),
    frk: z.number().min(0, 'FRK cannot be negative').optional(),
    other: z.number().min(0, 'Other cannot be negative').optional(),
    totalBalance: z
        .number()
        .min(0, 'Total balance cannot be negative')
        .optional(),
}

// Create balance lifting party schema
export const createBalanceLiftingPartySchema = z.object({
    body: z.object({
        ...balanceLiftingPartyBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update balance lifting party schema
export const updateBalanceLiftingPartySchema = z.object({
    body: z.object({
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        paddy: balanceLiftingPartyBaseSchema.paddy,
        rice: balanceLiftingPartyBaseSchema.rice,
        gunny: balanceLiftingPartyBaseSchema.gunny,
        frk: balanceLiftingPartyBaseSchema.frk,
        other: balanceLiftingPartyBaseSchema.other,
        totalBalance: balanceLiftingPartyBaseSchema.totalBalance,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Balance lifting party ID is required',
        }),
    }),
})

// Get balance lifting party by ID schema
export const getBalanceLiftingPartyByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Balance lifting party ID is required',
        }),
    }),
})

// Delete balance lifting party schema
export const deleteBalanceLiftingPartySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Balance lifting party ID is required',
        }),
    }),
})

// Bulk delete schema
export const bulkDeleteBalanceLiftingPartySchema = z.object({
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
export const getBalanceLiftingPartyListSchema = z.object({
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
export const getBalanceLiftingPartySummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
