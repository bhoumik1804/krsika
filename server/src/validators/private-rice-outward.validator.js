import { z } from 'zod'

/**
 * Private Rice Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const privateRiceOutwardBaseSchema = {
    date: z.string(),
    riceSaleDealNumber: z.string().trim().optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    lotNo: z.string().trim().optional(),
    fciNan: z.string().trim().optional(),
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    riceQty: z.number().min(0, 'Rice quantity cannot be negative').optional(),
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
    truckRst: z.string().trim().optional(),
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

// Create private rice outward schema
export const createPrivateRiceOutwardSchema = z.object({
    body: z.object({
        ...privateRiceOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update private rice outward schema
export const updatePrivateRiceOutwardSchema = z.object({
    body: z.object({
        date: privateRiceOutwardBaseSchema.date.optional(),
        riceSaleDealNumber: privateRiceOutwardBaseSchema.riceSaleDealNumber,
        partyName: privateRiceOutwardBaseSchema.partyName,
        brokerName: privateRiceOutwardBaseSchema.brokerName,
        lotNo: privateRiceOutwardBaseSchema.lotNo,
        fciNan: privateRiceOutwardBaseSchema.fciNan,
        riceType: privateRiceOutwardBaseSchema.riceType,
        riceQty: privateRiceOutwardBaseSchema.riceQty,
        gunnyNew: privateRiceOutwardBaseSchema.gunnyNew,
        gunnyOld: privateRiceOutwardBaseSchema.gunnyOld,
        gunnyPlastic: privateRiceOutwardBaseSchema.gunnyPlastic,
        juteWeight: privateRiceOutwardBaseSchema.juteWeight,
        plasticWeight: privateRiceOutwardBaseSchema.plasticWeight,
        truckNumber: privateRiceOutwardBaseSchema.truckNumber,
        truckRst: privateRiceOutwardBaseSchema.truckRst,
        truckWeight: privateRiceOutwardBaseSchema.truckWeight,
        gunnyWeight: privateRiceOutwardBaseSchema.gunnyWeight,
        netWeight: privateRiceOutwardBaseSchema.netWeight,
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
