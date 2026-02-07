import { z } from 'zod'

/**
 * Labour Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const labourOutwardBaseSchema = {
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
    outwardType: z
        .string()
        .trim()
        .max(100, 'Outward type is too long')
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
    loadingRate: z
        .number()
        .min(0, 'Loading rate cannot be negative')
        .optional(),
    dhulaiRate: z.number().min(0, 'Dhulai rate cannot be negative').optional(),
    labourGroupName: z
        .string()
        .trim()
        .max(200, 'Labour group name is too long')
        .optional(),
}

// Create labour outward schema
export const createLabourOutwardSchema = z.object({
    body: z.object({
        ...labourOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update labour outward schema
export const updateLabourOutwardSchema = z.object({
    body: z.object({
        date: labourOutwardBaseSchema.date.optional(),
        outwardType: labourOutwardBaseSchema.outwardType,
        truckNumber: labourOutwardBaseSchema.truckNumber,
        totalGunny: labourOutwardBaseSchema.totalGunny,
        numberOfGunnyBundle: labourOutwardBaseSchema.numberOfGunnyBundle,
        loadingRate: labourOutwardBaseSchema.loadingRate,
        dhulaiRate: labourOutwardBaseSchema.dhulaiRate,
        labourGroupName: labourOutwardBaseSchema.labourGroupName,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour outward ID is required' }),
    }),
})

// Get labour outward by ID schema
export const getLabourOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour outward ID is required' }),
    }),
})

// Delete labour outward schema
export const deleteLabourOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Labour outward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteLabourOutwardSchema = z.object({
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
export const getLabourOutwardListSchema = z.object({
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
export const getLabourOutwardSummarySchema = z.object({
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
