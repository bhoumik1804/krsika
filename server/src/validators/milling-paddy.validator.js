import { z } from 'zod'

/**
 * Milling Paddy Validators
 * Zod schemas for request validation
 */

// Common fields schema
const millingPaddyBaseSchema = {
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
    paddyType: z
        .string({ required_error: 'Paddy type is required' })
        .trim()
        .min(1, 'Paddy type cannot be empty')
        .max(100, 'Paddy type is too long'),
    hopperInGunny: z
        .number()
        .min(0, 'Hopper in gunny cannot be negative')
        .optional(),
    hopperInQintal: z
        .number()
        .min(0, 'Hopper in quintal cannot be negative')
        .optional(),
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
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
    kodhaQuantity: z
        .number()
        .min(0, 'Kodha quantity cannot be negative')
        .optional(),
    kodhaPercentage: z
        .number()
        .min(0, 'Kodha percentage cannot be negative')
        .max(100, 'Kodha percentage cannot exceed 100')
        .optional(),
    bhusaTon: z.number().min(0, 'Bhusa ton cannot be negative').optional(),
    bhusaPercentage: z
        .number()
        .min(0, 'Bhusa percentage cannot be negative')
        .max(100, 'Bhusa percentage cannot exceed 100')
        .optional(),
    nakkhiQuantity: z
        .number()
        .min(0, 'Nakkhi quantity cannot be negative')
        .optional(),
    nakkhiPercentage: z
        .number()
        .min(0, 'Nakkhi percentage cannot be negative')
        .max(100, 'Nakkhi percentage cannot exceed 100')
        .optional(),
    wastagePercentage: z
        .number()
        .min(0, 'Wastage percentage cannot be negative')
        .max(100, 'Wastage percentage cannot exceed 100')
        .optional(),
}

// Create milling paddy schema
export const createMillingPaddySchema = z.object({
    body: z.object({
        ...millingPaddyBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update milling paddy schema (all fields optional except id)
export const updateMillingPaddySchema = z.object({
    body: z.object({
        date: millingPaddyBaseSchema.date.optional(),
        paddyType: millingPaddyBaseSchema.paddyType.optional(),
        hopperInGunny: millingPaddyBaseSchema.hopperInGunny,
        hopperInQintal: millingPaddyBaseSchema.hopperInQintal,
        riceType: millingPaddyBaseSchema.riceType,
        riceQuantity: millingPaddyBaseSchema.riceQuantity,
        ricePercentage: millingPaddyBaseSchema.ricePercentage,
        khandaQuantity: millingPaddyBaseSchema.khandaQuantity,
        khandaPercentage: millingPaddyBaseSchema.khandaPercentage,
        kodhaQuantity: millingPaddyBaseSchema.kodhaQuantity,
        kodhaPercentage: millingPaddyBaseSchema.kodhaPercentage,
        bhusaTon: millingPaddyBaseSchema.bhusaTon,
        bhusaPercentage: millingPaddyBaseSchema.bhusaPercentage,
        nakkhiQuantity: millingPaddyBaseSchema.nakkhiQuantity,
        nakkhiPercentage: millingPaddyBaseSchema.nakkhiPercentage,
        wastagePercentage: millingPaddyBaseSchema.wastagePercentage,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Milling paddy ID is required' }),
    }),
})

// Get milling paddy by ID schema
export const getMillingPaddyByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Milling paddy ID is required' }),
    }),
})

// Delete milling paddy schema
export const deleteMillingPaddySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Milling paddy ID is required' }),
    }),
})

// Bulk delete milling paddy schema
export const bulkDeleteMillingPaddySchema = z.object({
    body: z.object({
        ids: z
            .array(z.string({ required_error: 'ID is required' }))
            .min(1, 'At least one ID is required'),
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// List milling paddy schema (query params)
export const listMillingPaddySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        search: z.string().optional(),
        paddyType: z.string().optional(),
        riceType: z.string().optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

// Summary milling paddy schema
export const summaryMillingPaddySchema = z.object({
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
