import { z } from 'zod'

/**
 * Labour Other Validators
 * Zod schemas for request validation
 */

// Common fields schema
const labourOtherBaseSchema = {
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
    labourType: z
        .string()
        .trim()
        .max(100, 'Labour type is too long')
        .optional(),
    labourGroupName: z
        .string()
        .trim()
        .max(200, 'Labour group name is too long')
        .optional(),
    numberOfGunny: z
        .number()
        .int('Number of gunny must be a whole number')
        .min(0, 'Number of gunny cannot be negative')
        .optional(),
    labourRate: z.number().min(0, 'Labour rate cannot be negative').optional(),
    workDetail: z
        .string()
        .trim()
        .max(500, 'Work detail is too long')
        .optional(),
    totalPrice: z.number().min(0, 'Total price cannot be negative').optional(),
}

// Create labour other schema
export const createLabourOtherSchema = z.object({
    body: z.object({
        ...labourOtherBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update labour other schema
export const updateLabourOtherSchema = z.object({
    body: z.object({
        date: labourOtherBaseSchema.date.optional(),
        labourType: labourOtherBaseSchema.labourType,
        labourGroupName: labourOtherBaseSchema.labourGroupName,
        numberOfGunny: labourOtherBaseSchema.numberOfGunny,
        labourRate: labourOtherBaseSchema.labourRate,
        workDetail: labourOtherBaseSchema.workDetail,
        totalPrice: labourOtherBaseSchema.totalPrice,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour other ID is required' }),
    }),
})

// Get labour other by ID schema
export const getLabourOtherByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour other ID is required' }),
    }),
})

// Delete labour other schema
export const deleteLabourOtherSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour other ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteLabourOtherSchema = z.object({
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
export const getLabourOtherListSchema = z.object({
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
            .enum(['date', 'labourGroupName', 'labourType', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getLabourOtherSummarySchema = z.object({
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
