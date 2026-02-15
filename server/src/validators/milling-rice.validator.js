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
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    hopperInGunny: z
        .number()
        .min(0, 'Hopper in gunny cannot be negative')
        .optional(),
    hopperInQintal: z
        .number()
        .min(0, 'Hopper in quintal cannot be negative')
        .optional(),
    riceQuantity: z
        .number()
        .min(0, 'Rice quantity cannot be negative')
        .optional(),
    ricePercentage: z
        .number()
        .min(0, 'Rice percentage cannot be negative')
        .max(100, 'Rice percentage cannot exceed 100')
        .optional(),
    khandaQuantity: z
        .number()
        .min(0, 'Khanda quantity cannot be negative')
        .optional(),
    khandaPercentage: z
        .number()
        .min(0, 'Khanda percentage cannot be negative')
        .max(100, 'Khanda percentage cannot exceed 100')
        .optional(),
    silkyKodhaQuantity: z
        .number()
        .min(0, 'Silky kodha quantity cannot be negative')
        .optional(),
    silkyKodhaPercentage: z
        .number()
        .min(0, 'Silky kodha percentage cannot be negative')
        .max(100, 'Silky kodha percentage cannot exceed 100')
        .optional(),
    wastagePercentage: z
        .number()
        .min(0, 'Wastage percentage cannot be negative')
        .max(100, 'Wastage percentage cannot exceed 100')
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
        riceType: millingRiceBaseSchema.riceType,
        hopperInGunny: millingRiceBaseSchema.hopperInGunny,
        hopperInQintal: millingRiceBaseSchema.hopperInQintal,
        riceQuantity: millingRiceBaseSchema.riceQuantity,
        ricePercentage: millingRiceBaseSchema.ricePercentage,
        khandaQuantity: millingRiceBaseSchema.khandaQuantity,
        khandaPercentage: millingRiceBaseSchema.khandaPercentage,
        silkyKodhaQuantity: millingRiceBaseSchema.silkyKodhaQuantity,
        silkyKodhaPercentage: millingRiceBaseSchema.silkyKodhaPercentage,
        wastagePercentage: millingRiceBaseSchema.wastagePercentage,
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
            .enum(['date', 'riceType', 'createdAt'])
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
