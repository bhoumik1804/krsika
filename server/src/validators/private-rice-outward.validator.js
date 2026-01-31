import { z } from 'zod'

/**
 * Private Rice Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const privateRiceOutwardBaseSchema = {
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
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    truckNumber: z
        .string()
        .trim()
        .max(20, 'Truck number is too long')
        .optional(),
    riceGunny: z.number().min(0, 'Rice gunny cannot be negative').optional(),
    grossWeight: z
        .number()
        .min(0, 'Gross weight cannot be negative')
        .optional(),
    tareWeight: z.number().min(0, 'Tare weight cannot be negative').optional(),
    netWeight: z.number().min(0, 'Net weight cannot be negative').optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
}

// Create private rice outward schema
export const createPrivateRiceOutwardSchema = z.object({
    body: z.object({
        ...privateRiceOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update private rice outward schema (all fields optional except id)
export const updatePrivateRiceOutwardSchema = z.object({
    body: z.object({
        date: privateRiceOutwardBaseSchema.date.optional(),
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        riceType: privateRiceOutwardBaseSchema.riceType,
        truckNumber: privateRiceOutwardBaseSchema.truckNumber,
        riceGunny: privateRiceOutwardBaseSchema.riceGunny,
        grossWeight: privateRiceOutwardBaseSchema.grossWeight,
        tareWeight: privateRiceOutwardBaseSchema.tareWeight,
        netWeight: privateRiceOutwardBaseSchema.netWeight,
        rate: privateRiceOutwardBaseSchema.rate,
        brokerName: privateRiceOutwardBaseSchema.brokerName,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Private rice outward ID is required' }),
    }),
})

// Get private rice outward by ID schema
export const getPrivateRiceOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Private rice outward ID is required' }),
    }),
})

// Delete private rice outward schema
export const deletePrivateRiceOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Private rice outward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeletePrivateRiceOutwardSchema = z.object({
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
export const getPrivateRiceOutwardListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        riceType: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        brokerName: z.string().trim().optional(),
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
                'brokerName',
                'truckNumber',
                'riceType',
                'netWeight',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getPrivateRiceOutwardSummarySchema = z.object({
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
