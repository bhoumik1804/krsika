import { z } from 'zod'

/**
 * Gunny Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const gunnyInwardBaseSchema = {
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
    gunnyType: z.string().trim().max(100, 'Gunny type is too long').optional(),
    totalGunny: z.number().min(0, 'Total gunny cannot be negative').optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    amount: z.number().min(0, 'Amount cannot be negative').optional(),
}

// Create gunny inward schema
export const createGunnyInwardSchema = z.object({
    body: z.object({
        ...gunnyInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update gunny inward schema (all fields optional except id)
export const updateGunnyInwardSchema = z.object({
    body: z.object({
        date: gunnyInwardBaseSchema.date.optional(),
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        gunnyType: gunnyInwardBaseSchema.gunnyType,
        totalGunny: gunnyInwardBaseSchema.totalGunny,
        rate: gunnyInwardBaseSchema.rate,
        amount: gunnyInwardBaseSchema.amount,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Gunny inward ID is required' }),
    }),
})

// Get gunny inward by ID schema
export const getGunnyInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Gunny inward ID is required' }),
    }),
})

// Delete gunny inward schema
export const deleteGunnyInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Gunny inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteGunnyInwardSchema = z.object({
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
export const listGunnyInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        gunnyType: z.string().trim().optional(),
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
            .enum([
                'date',
                'partyName',
                'gunnyType',
                'totalGunny',
                'amount',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryGunnyInwardSchema = z.object({
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
