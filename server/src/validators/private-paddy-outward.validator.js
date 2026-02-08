import { z } from 'zod'

/**
 * Private Paddy Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const privatePaddyOutwardBaseSchema = {
    date: z.string(),
    paddySaleDealNumber: z
        .string()
        .trim()
        .max(100, 'Paddy sale deal number is too long')
        .optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    paddyType: z.string().trim().max(100, 'Paddy type is too long').optional(),
    doQty: z.number().min(0, 'DO quantity cannot be negative').optional(),
    gunnyNew: z.number().min(0, 'Gunny new cannot be negative').optional(),
    gunnyOld: z.number().min(0, 'Gunny old cannot be negative').optional(),
    gunnyPlastic: z
        .number()
        .min(0, 'Gunny plastic cannot be negative')
        .optional(),
    juteWeight: z.number().min(0, 'Jute weight cannot be negative').optional(),
    plasticWeight: z
        .number()
        .min(0, 'Plastic weight cannot be negative')
        .optional(),
    truckNumber: z
        .string()
        .trim()
        .max(20, 'Truck number is too long')
        .optional(),
    rstNumber: z.string().trim().max(100, 'RST number is too long').optional(),
    truckWeight: z
        .number()
        .min(0, 'Truck weight cannot be negative')
        .optional(),
    gunnyWeight: z
        .number()
        .min(0, 'Gunny weight cannot be negative')
        .optional(),
    netWeight: z.number().min(0, 'Net weight cannot be negative').optional(),
}

// Create private paddy outward schema
export const createPrivatePaddyOutwardSchema = z.object({
    body: z.object({
        ...privatePaddyOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update private paddy outward schema
export const updatePrivatePaddyOutwardSchema = z.object({
    body: z.object({
        date: privatePaddyOutwardBaseSchema.date.optional(),
        paddySaleDealNumber: privatePaddyOutwardBaseSchema.paddySaleDealNumber,
        partyName: privatePaddyOutwardBaseSchema.partyName,
        brokerName: privatePaddyOutwardBaseSchema.brokerName,
        paddyType: privatePaddyOutwardBaseSchema.paddyType,
        doQty: privatePaddyOutwardBaseSchema.doQty,
        gunnyNew: privatePaddyOutwardBaseSchema.gunnyNew,
        gunnyOld: privatePaddyOutwardBaseSchema.gunnyOld,
        gunnyPlastic: privatePaddyOutwardBaseSchema.gunnyPlastic,
        juteWeight: privatePaddyOutwardBaseSchema.juteWeight,
        plasticWeight: privatePaddyOutwardBaseSchema.plasticWeight,
        truckNumber: privatePaddyOutwardBaseSchema.truckNumber,
        rstNumber: privatePaddyOutwardBaseSchema.rstNumber,
        truckWeight: privatePaddyOutwardBaseSchema.truckWeight,
        gunnyWeight: privatePaddyOutwardBaseSchema.gunnyWeight,
        netWeight: privatePaddyOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Private paddy outward ID is required',
        }),
    }),
})

// Get private paddy outward by ID schema
export const getPrivatePaddyOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Private paddy outward ID is required',
        }),
    }),
})

// Delete private paddy outward schema
export const deletePrivatePaddyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Private paddy outward ID is required',
        }),
    }),
})

// Bulk delete schema
export const bulkDeletePrivatePaddyOutwardSchema = z.object({
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
export const getPrivatePaddyOutwardListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        paddyType: z.string().trim().optional(),
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
                'paddyType',
                'netWeight',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getPrivatePaddyOutwardSummarySchema = z.object({
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
