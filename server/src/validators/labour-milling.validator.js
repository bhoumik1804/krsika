import { z } from 'zod'

/**
 * Labour Milling Validators
 * Zod schemas for request validation
 */

// Common fields schema
const labourMillingBaseSchema = {
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
    hopperInGunny: z
        .number()
        .min(0, 'Hopper in gunny cannot be negative')
        .optional(),
    hopperRate: z.number().min(0, 'Hopper rate cannot be negative').optional(),
    labourGroupName: z
        .string()
        .trim()
        .max(200, 'Labour group name is too long')
        .optional(),
}

// Create labour milling schema
export const createLabourMillingSchema = z.object({
    body: z.object({
        ...labourMillingBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update labour milling schema
export const updateLabourMillingSchema = z.object({
    body: z.object({
        date: labourMillingBaseSchema.date.optional(),
        hopperInGunny: labourMillingBaseSchema.hopperInGunny,
        hopperRate: labourMillingBaseSchema.hopperRate,
        labourGroupName: labourMillingBaseSchema.labourGroupName,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour milling ID is required' }),
    }),
})

// Get labour milling by ID schema
export const getLabourMillingByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour milling ID is required' }),
    }),
})

// Delete labour milling schema
export const deleteLabourMillingSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour milling ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteLabourMillingSchema = z.object({
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
export const getLabourMillingListSchema = z.object({
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
            .enum(['date', 'labourGroupName', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getLabourMillingSummarySchema = z.object({
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
