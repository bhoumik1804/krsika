import { z } from 'zod'

/**
 * FRK Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const frkInwardBaseSchema = {
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
    totalWeight: z
        .number()
        .min(0, 'Total weight cannot be negative')
        .optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    amount: z.number().min(0, 'Amount cannot be negative').optional(),
}

// Create FRK inward schema
export const createFrkInwardSchema = z.object({
    body: z.object({
        ...frkInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update FRK inward schema (all fields optional except id)
export const updateFrkInwardSchema = z.object({
    body: z.object({
        date: frkInwardBaseSchema.date.optional(),
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        totalWeight: frkInwardBaseSchema.totalWeight,
        rate: frkInwardBaseSchema.rate,
        amount: frkInwardBaseSchema.amount,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK inward ID is required' }),
    }),
})

// Get FRK inward by ID schema
export const getFrkInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK inward ID is required' }),
    }),
})

// Delete FRK inward schema
export const deleteFrkInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFrkInwardSchema = z.object({
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
export const listFrkInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'partyName', 'totalWeight', 'amount', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryFrkInwardSchema = z.object({
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
