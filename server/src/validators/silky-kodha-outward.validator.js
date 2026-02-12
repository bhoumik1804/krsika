import { z } from 'zod'

/**
 * Silky Kodha Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const silkyKodhaOutwardBaseSchema = {
    date: z.string(),
    silkyKodhaSaleDealNumber: z.string().trim().optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    oil: z.number().min(0, 'Oil cannot be negative').optional(),
    brokerage: z.number().min(0, 'Brokerage cannot be negative').optional(),
    gunnyPlastic: z
        .number()
        .min(0, 'Gunny plastic cannot be negative')
        .optional(),
    plasticWeight: z
        .number()
        .min(0, 'Plastic weight cannot be negative')
        .optional(),
    truckNo: z.string().trim().max(20, 'Truck number is too long').optional(),
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

// Create silky kodha outward schema
export const createSilkyKodhaOutwardSchema = z.object({
    body: z.object({
        ...silkyKodhaOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update silky kodha outward schema
export const updateSilkyKodhaOutwardSchema = z.object({
    body: z.object({
        date: silkyKodhaOutwardBaseSchema.date.optional(),
        silkyKodhaSaleDealNumber:
            silkyKodhaOutwardBaseSchema.silkyKodhaSaleDealNumber,
        partyName: silkyKodhaOutwardBaseSchema.partyName,
        brokerName: silkyKodhaOutwardBaseSchema.brokerName,
        rate: silkyKodhaOutwardBaseSchema.rate,
        oil: silkyKodhaOutwardBaseSchema.oil,
        brokerage: silkyKodhaOutwardBaseSchema.brokerage,
        gunnyPlastic: silkyKodhaOutwardBaseSchema.gunnyPlastic,
        plasticWeight: silkyKodhaOutwardBaseSchema.plasticWeight,
        truckNo: silkyKodhaOutwardBaseSchema.truckNo,
        truckRst: silkyKodhaOutwardBaseSchema.truckRst,
        truckWeight: silkyKodhaOutwardBaseSchema.truckWeight,
        gunnyWeight: silkyKodhaOutwardBaseSchema.gunnyWeight,
        netWeight: silkyKodhaOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Silky kodha outward ID is required',
        }),
    }),
})

// Get silky kodha outward by ID schema
export const getSilkyKodhaOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Silky kodha outward ID is required',
        }),
    }),
})

// Delete silky kodha outward schema
export const deleteSilkyKodhaOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Silky kodha outward ID is required',
        }),
    }),
})

// Bulk delete silky kodha outward schema
export const bulkDeleteSilkyKodhaOutwardSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string())
            .min(1, 'At least one ID is required')
            .max(100, 'Cannot delete more than 100 entries at once'),
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Get silky kodha outward list schema
export const getSilkyKodhaOutwardListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
        partyName: z.string().optional(),
        brokerName: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        sortBy: z
            .enum([
                'date',
                'partyName',
                'brokerName',
                'truckNo',
                'netWeight',
                'createdAt',
            ])
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

// Get silky kodha outward summary schema
export const getSilkyKodhaOutwardSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})
