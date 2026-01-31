import { z } from 'zod'

/**
 * Labour Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const labourInwardBaseSchema = {
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
    inwardType: z
        .string()
        .trim()
        .max(100, 'Inward type is too long')
        .optional(),
    truckNumber: z
        .string()
        .trim()
        .max(20, 'Truck number is too long')
        .optional(),
    totalGunny: z.number().min(0, 'Total gunny cannot be negative').optional(),
    numberOfGunnyBundle: z
        .number()
        .int('Number of gunny bundle must be a whole number')
        .min(0, 'Number of gunny bundle cannot be negative')
        .optional(),
    unloadingRate: z
        .number()
        .min(0, 'Unloading rate cannot be negative')
        .optional(),
    stackingRate: z
        .number()
        .min(0, 'Stacking rate cannot be negative')
        .optional(),
    labourGroupName: z
        .string()
        .trim()
        .max(200, 'Labour group name is too long')
        .optional(),
}

// Create labour inward schema
export const createLabourInwardSchema = z.object({
    body: z.object({
        ...labourInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update labour inward schema
export const updateLabourInwardSchema = z.object({
    body: z.object({
        date: labourInwardBaseSchema.date.optional(),
        inwardType: labourInwardBaseSchema.inwardType,
        truckNumber: labourInwardBaseSchema.truckNumber,
        totalGunny: labourInwardBaseSchema.totalGunny,
        numberOfGunnyBundle: labourInwardBaseSchema.numberOfGunnyBundle,
        unloadingRate: labourInwardBaseSchema.unloadingRate,
        stackingRate: labourInwardBaseSchema.stackingRate,
        labourGroupName: labourInwardBaseSchema.labourGroupName,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour inward ID is required' }),
    }),
})

// Get labour inward by ID schema
export const getLabourInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour inward ID is required' }),
    }),
})

// Delete labour inward schema
export const deleteLabourInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteLabourInwardSchema = z.object({
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
export const getLabourInwardListSchema = z.object({
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
export const getLabourInwardSummarySchema = z.object({
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
