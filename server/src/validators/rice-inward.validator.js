import { z } from 'zod'

/**
 * Rice Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema - matches RiceInward model
const riceInwardBaseSchema = {
    date: z.string(),
    ricePurchaseNumber: z
        .string()
        .trim()
        .max(100, 'Rice purchase number is too long')
        .optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    balanceInward: z
        .number()
        .min(0, 'Balance inward cannot be negative')
        .optional(),
    inwardType: z
        .string()
        .trim()
        .max(100, 'Inward type is too long')
        .optional(),
    lotNumber: z.string().trim().max(100, 'Lot number is too long').optional(),
    frkOrNAN: z.string().trim().max(100, 'FRK or NAN is too long').optional(),
    gunnyOption: z
        .string()
        .trim()
        .max(100, 'Gunny option is too long')
        .optional(),
    gunnyNew: z.number().min(0, 'Cannot be negative').optional(),
    gunnyOld: z.number().min(0, 'Cannot be negative').optional(),
    gunnyPlastic: z.number().min(0, 'Cannot be negative').optional(),
    juteWeight: z.number().min(0, 'Cannot be negative').optional(),
    plasticWeight: z.number().min(0, 'Cannot be negative').optional(),
    gunnyWeight: z.number().min(0, 'Cannot be negative').optional(),
    truckNumber: z
        .string()
        .trim()
        .max(50, 'Truck number is too long')
        .optional(),
    rstNumber: z.string().trim().max(50, 'RST number is too long').optional(),
    truckLoadWeight: z.number().min(0, 'Cannot be negative').optional(),
    riceMotaNetWeight: z.number().min(0, 'Cannot be negative').optional(),
    ricePatlaNetWeight: z.number().min(0, 'Cannot be negative').optional(),
}

// Create rice inward schema
export const createRiceInwardSchema = z.object({
    body: z.object({
        ...riceInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update rice inward schema (all fields optional except id)
export const updateRiceInwardSchema = z.object({
    body: z.object({
        date: riceInwardBaseSchema.date.optional(),
        ricePurchaseNumber: riceInwardBaseSchema.ricePurchaseNumber,
        partyName: riceInwardBaseSchema.partyName,
        brokerName: riceInwardBaseSchema.brokerName,
        riceType: riceInwardBaseSchema.riceType,
        balanceInward: riceInwardBaseSchema.balanceInward,
        inwardType: riceInwardBaseSchema.inwardType,
        lotNumber: riceInwardBaseSchema.lotNumber,
        frkOrNAN: riceInwardBaseSchema.frkOrNAN,
        gunnyOption: riceInwardBaseSchema.gunnyOption,
        gunnyNew: riceInwardBaseSchema.gunnyNew,
        gunnyOld: riceInwardBaseSchema.gunnyOld,
        gunnyPlastic: riceInwardBaseSchema.gunnyPlastic,
        juteWeight: riceInwardBaseSchema.juteWeight,
        plasticWeight: riceInwardBaseSchema.plasticWeight,
        gunnyWeight: riceInwardBaseSchema.gunnyWeight,
        truckNumber: riceInwardBaseSchema.truckNumber,
        rstNumber: riceInwardBaseSchema.rstNumber,
        truckLoadWeight: riceInwardBaseSchema.truckLoadWeight,
        riceMotaNetWeight: riceInwardBaseSchema.riceMotaNetWeight,
        ricePatlaNetWeight: riceInwardBaseSchema.ricePatlaNetWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice inward ID is required' }),
    }),
})

// Get rice inward by ID schema
export const getRiceInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice inward ID is required' }),
    }),
})

// Delete rice inward schema
export const deleteRiceInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteRiceInwardSchema = z.object({
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
export const getRiceInwardListSchema = z.object({
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
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getRiceInwardSummarySchema = z.object({
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
