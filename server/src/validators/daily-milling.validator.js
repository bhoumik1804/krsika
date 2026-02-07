import { z } from 'zod'

/**
 * Daily Milling Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailyMillingBaseSchema = {
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
    shift: z.enum(['Day', 'Night'], {
        errorMap: () => ({
            message: 'Shift must be Day or Night',
        }),
    }),
    paddyType: z
        .string({ required_error: 'Paddy type is required' })
        .trim()
        .min(1, 'Paddy type cannot be empty')
        .max(200, 'Paddy type is too long'),
    paddyQuantity: z
        .number({ required_error: 'Paddy quantity is required' })
        .min(0, 'Paddy quantity cannot be negative'),
    riceYield: z
        .number({ required_error: 'Rice yield is required' })
        .min(0, 'Rice yield cannot be negative'),
    brokenYield: z
        .number({ required_error: 'Broken yield is required' })
        .min(0, 'Broken yield cannot be negative'),
    branYield: z
        .number({ required_error: 'Bran yield is required' })
        .min(0, 'Bran yield cannot be negative'),
    huskYield: z
        .number({ required_error: 'Husk yield is required' })
        .min(0, 'Husk yield cannot be negative'),
    status: z.enum(['scheduled', 'in-progress', 'completed', 'halted'], {
        errorMap: () => ({
            message:
                'Status must be scheduled, in-progress, completed, or halted',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily milling schema
export const createDailyMillingSchema = z.object({
    body: z.object({
        ...dailyMillingBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily milling schema (all fields optional except id)
export const updateDailyMillingSchema = z.object({
    body: z.object({
        date: dailyMillingBaseSchema.date.optional(),
        shift: dailyMillingBaseSchema.shift.optional(),
        paddyType: dailyMillingBaseSchema.paddyType.optional(),
        paddyQuantity: dailyMillingBaseSchema.paddyQuantity.optional(),
        riceYield: dailyMillingBaseSchema.riceYield.optional(),
        brokenYield: dailyMillingBaseSchema.brokenYield.optional(),
        branYield: dailyMillingBaseSchema.branYield.optional(),
        huskYield: dailyMillingBaseSchema.huskYield.optional(),
        status: dailyMillingBaseSchema.status.optional(),
        remarks: dailyMillingBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily milling ID is required' }),
    }),
})

// Get daily milling by ID schema
export const getDailyMillingByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily milling ID is required' }),
    }),
})

// Delete daily milling schema
export const deleteDailyMillingSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily milling ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailyMillingSchema = z.object({
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
export const listDailyMillingSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z
            .enum(['scheduled', 'in-progress', 'completed', 'halted'])
            .optional(),
        shift: z.enum(['Day', 'Night']).optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'paddyType', 'paddyQuantity', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryDailyMillingSchema = z.object({
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
