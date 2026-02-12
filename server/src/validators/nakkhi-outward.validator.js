import { z } from 'zod'

/**
 * Nakkhi Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const nakkhiOutwardBaseSchema = {
    date: z.string(),
    nakkhiSaleDealNumber: z.string().trim().optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
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

// Create nakkhi outward schema
export const createNakkhiOutwardSchema = z.object({
    body: z.object({
        ...nakkhiOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update nakkhi outward schema
export const updateNakkhiOutwardSchema = z.object({
    body: z.object({
        date: nakkhiOutwardBaseSchema.date.optional(),
        nakkhiSaleDealNumber: nakkhiOutwardBaseSchema.nakkhiSaleDealNumber,
        partyName: nakkhiOutwardBaseSchema.partyName,
        brokerName: nakkhiOutwardBaseSchema.brokerName,
        rate: nakkhiOutwardBaseSchema.rate,
        brokerage: nakkhiOutwardBaseSchema.brokerage,
        gunnyPlastic: nakkhiOutwardBaseSchema.gunnyPlastic,
        plasticGunnyWeight: nakkhiOutwardBaseSchema.plasticGunnyWeight,
        truckNo: nakkhiOutwardBaseSchema.truckNo,
        truckRst: nakkhiOutwardBaseSchema.truckRst,
        truckWeight: nakkhiOutwardBaseSchema.truckWeight,
        gunnyWeight: nakkhiOutwardBaseSchema.gunnyWeight,
        netWeight: nakkhiOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Nakkhi outward ID is required' }),
    }),
})

// Get nakkhi outward by ID schema
export const getNakkhiOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Nakkhi outward ID is required' }),
    }),
})

// Delete nakkhi outward schema
export const deleteNakkhiOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Nakkhi outward ID is required' }),
    }),
})

// Bulk delete nakkhi outward schema
export const bulkDeleteNakkhiOutwardSchema = z.object({
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

// Get nakkhi outward list schema
export const getNakkhiOutwardListSchema = z.object({
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

// Get nakkhi outward summary schema
export const getNakkhiOutwardSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})
