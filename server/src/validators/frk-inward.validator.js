import { z } from 'zod'

/**
 * FRK Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema - matches FrkInward model
const frkInwardBaseSchema = {
    date: z.string(),
    frkPurchaseDealNumber: z
        .string()
        .trim()
        .max(100, 'FRK purchase deal number is too long')
        .optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    gunnyPlastic: z.number().min(0, 'Cannot be negative').optional(),
    plasticWeight: z.number().min(0, 'Cannot be negative').optional(),
    truckNumber: z
        .string()
        .trim()
        .max(50, 'Truck number is too long')
        .optional(),
    rstNumber: z.string().trim().max(50, 'RST number is too long').optional(),
    truckWeight: z.number().min(0, 'Cannot be negative').optional(),
    gunnyWeight: z.number().min(0, 'Cannot be negative').optional(),
    netWeight: z.number().min(0, 'Cannot be negative').optional(),
}

// Create FRK inward schema
export const createFrkInwardSchema = z.object({
    body: z.object({
        ...frkInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update FRK inward schema (all fields optional except id)
export const updateFrkInwardSchema = z.object({
    body: z.object({
        date: frkInwardBaseSchema.date.optional(),
        frkPurchaseDealNumber: frkInwardBaseSchema.frkPurchaseDealNumber,
        partyName: frkInwardBaseSchema.partyName,
        gunnyPlastic: frkInwardBaseSchema.gunnyPlastic,
        plasticWeight: frkInwardBaseSchema.plasticWeight,
        truckNumber: frkInwardBaseSchema.truckNumber,
        rstNumber: frkInwardBaseSchema.rstNumber,
        truckWeight: frkInwardBaseSchema.truckWeight,
        gunnyWeight: frkInwardBaseSchema.gunnyWeight,
        netWeight: frkInwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK inward ID is required' }),
    }),
})

// Get FRK inward by ID schema
export const getFrkInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK inward ID is required' }),
    }),
})

// Delete FRK inward schema
export const deleteFrkInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFrkInwardSchema = z.object({
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
export const getFrkInwardListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'partyName', 'netWeight', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getFrkInwardSummarySchema = z.object({
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
