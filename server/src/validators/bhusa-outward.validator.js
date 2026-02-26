import { z } from 'zod'

/**
 * Bhusa Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const bhusaOutwardBaseSchema = {
    date: z.string(),
    bhusaSaleDealNumber: z.string().trim().optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    brokerage: z.number().min(0, 'Brokerage cannot be negative').optional(),
    truckNo: z.string().trim().max(20, 'Truck number is too long').optional(),
    truckRst: z.string().trim().optional(),
    truckWeight: z
        .number()
        .min(0, 'Truck weight cannot be negative')
        .optional(),
}

// Create bhusa outward schema
export const createBhusaOutwardSchema = z.object({
    body: z.object({
        ...bhusaOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update bhusa outward schema
export const updateBhusaOutwardSchema = z.object({
    body: z.object({
        date: bhusaOutwardBaseSchema.date.optional(),
        bhusaSaleDealNumber: bhusaOutwardBaseSchema.bhusaSaleDealNumber,
        partyName: bhusaOutwardBaseSchema.partyName,
        brokerName: bhusaOutwardBaseSchema.brokerName,
        rate: bhusaOutwardBaseSchema.rate,
        brokerage: bhusaOutwardBaseSchema.brokerage,
        truckNo: bhusaOutwardBaseSchema.truckNo,
        truckRst: bhusaOutwardBaseSchema.truckRst,
        truckWeight: bhusaOutwardBaseSchema.truckWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Bhusa outward ID is required' }),
    }),
})

// Get bhusa outward by ID schema
export const getBhusaOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Bhusa outward ID is required' }),
    }),
})

// Delete bhusa outward schema
export const deleteBhusaOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Bhusa outward ID is required' }),
    }),
})

// Bulk delete bhusa outward schema
export const bulkDeleteBhusaOutwardSchema = z.object({
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

// Get bhusa outward list schema
export const getBhusaOutwardListSchema = z.object({
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

// Get bhusa outward summary schema
export const getBhusaOutwardSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})
