import { z } from 'zod'

/**
 * Kodha Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const kodhaOutwardBaseSchema = {
    date: z.string(),
    kodhaSaleDealNumber: z.string().trim().optional(),
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

// Create kodha outward schema
export const createKodhaOutwardSchema = z.object({
    body: z.object({
        ...kodhaOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update kodha outward schema
export const updateKodhaOutwardSchema = z.object({
    body: z.object({
        date: kodhaOutwardBaseSchema.date.optional(),
        kodhaSaleDealNumber: kodhaOutwardBaseSchema.kodhaSaleDealNumber,
        partyName: kodhaOutwardBaseSchema.partyName,
        brokerName: kodhaOutwardBaseSchema.brokerName,
        rate: kodhaOutwardBaseSchema.rate,
        oil: kodhaOutwardBaseSchema.oil,
        brokerage: kodhaOutwardBaseSchema.brokerage,
        gunnyPlastic: kodhaOutwardBaseSchema.gunnyPlastic,
        plasticGunnyWeight: kodhaOutwardBaseSchema.plasticGunnyWeight,
        truckNo: kodhaOutwardBaseSchema.truckNo,
        truckRst: kodhaOutwardBaseSchema.truckRst,
        truckWeight: kodhaOutwardBaseSchema.truckWeight,
        gunnyWeight: kodhaOutwardBaseSchema.gunnyWeight,
        netWeight: kodhaOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Kodha outward ID is required' }),
    }),
})

// Get kodha outward by ID schema
export const getKodhaOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Kodha outward ID is required' }),
    }),
})

// Delete kodha outward schema
export const deleteKodhaOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Kodha outward ID is required' }),
    }),
})

// Bulk delete kodha outward schema
export const bulkDeleteKodhaOutwardSchema = z.object({
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

// Get kodha outward list schema
export const getKodhaOutwardListSchema = z.object({
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

// Get kodha outward summary schema
export const getKodhaOutwardSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})
