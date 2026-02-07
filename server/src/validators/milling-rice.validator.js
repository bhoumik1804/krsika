import { z } from 'zod'

/**
 * Milling Rice Validators
 * Zod schemas for request validation
 */

// Common fields schema
const millingRiceBaseSchema = {
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
    riceLot: z.string().trim().max(100, 'Rice lot is too long').optional(),
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    totalPaddy: z.number().min(0, 'Total paddy cannot be negative').optional(),
    totalRice: z.number().min(0, 'Total rice cannot be negative').optional(),
    brokenRice: z.number().min(0, 'Broken rice cannot be negative').optional(),
    khurai: z.number().min(0, 'Khurai cannot be negative').optional(),
    millRecovery: z
        .number()
        .min(0, 'Mill recovery cannot be negative')
        .max(100, 'Mill recovery cannot exceed 100%')
        .optional(),
}

// Create milling rice schema
export const createMillingRiceSchema = z.object({
    body: z.object({
        ...millingRiceBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update milling rice schema
export const updateMillingRiceSchema = z.object({
    body: z.object({
        date: millingRiceBaseSchema.date.optional(),
        riceLot: millingRiceBaseSchema.riceLot,
        riceType: millingRiceBaseSchema.riceType,
        totalPaddy: millingRiceBaseSchema.totalPaddy,
        totalRice: millingRiceBaseSchema.totalRice,
        brokenRice: millingRiceBaseSchema.brokenRice,
        khurai: millingRiceBaseSchema.khurai,
        millRecovery: millingRiceBaseSchema.millRecovery,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Milling rice ID is required' }),
    }),
})

// Get milling rice by ID schema
export const getMillingRiceByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Milling rice ID is required' }),
    }),
})

// Delete milling rice schema
export const deleteMillingRiceSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Milling rice ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteMillingRiceSchema = z.object({
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
export const getMillingRiceListSchema = z.object({
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
            .enum(['date', 'riceLot', 'riceType', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getMillingRiceSummarySchema = z.object({
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
