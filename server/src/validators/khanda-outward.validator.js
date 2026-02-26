import { z } from 'zod'

/**
 * Khanda Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const khandaOutwardBaseSchema = {
    date: z.string(),
    khandaSaleDealNumber: z.string().trim().optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    gunnyPlastic: z
        .number()
        .min(0, 'Gunny plastic cannot be negative')
        .optional(),
    plasticGunnyWeight: z
        .number()
        .min(0, 'Plastic gunny weight cannot be negative')
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

// Create khanda outward schema
export const createKhandaOutwardSchema = z.object({
    body: z.object({
        ...khandaOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update khanda outward schema
export const updateKhandaOutwardSchema = z.object({
    body: z.object({
        date: khandaOutwardBaseSchema.date.optional(),
        khandaSaleDealNumber: khandaOutwardBaseSchema.khandaSaleDealNumber,
        partyName: khandaOutwardBaseSchema.partyName,
        brokerName: khandaOutwardBaseSchema.brokerName,
        gunnyPlastic: khandaOutwardBaseSchema.gunnyPlastic,
        plasticGunnyWeight: khandaOutwardBaseSchema.plasticGunnyWeight,
        truckNo: khandaOutwardBaseSchema.truckNo,
        truckRst: khandaOutwardBaseSchema.truckRst,
        truckWeight: khandaOutwardBaseSchema.truckWeight,
        gunnyWeight: khandaOutwardBaseSchema.gunnyWeight,
        netWeight: khandaOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Khanda outward ID is required' }),
    }),
})

// Get khanda outward by ID schema
export const getKhandaOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Khanda outward ID is required' }),
    }),
})

// Delete khanda outward schema
export const deleteKhandaOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Khanda outward ID is required' }),
    }),
})

// Bulk delete khanda outward schema
export const bulkDeleteKhandaOutwardSchema = z.object({
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

// Get khanda outward list schema
export const getKhandaOutwardListSchema = z.object({
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
            .enum(['date', 'partyName', 'brokerName', 'truckNo', 'createdAt'])
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

// Get khanda outward summary schema
export const getKhandaOutwardSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})
