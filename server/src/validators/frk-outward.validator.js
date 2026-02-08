import { z } from 'zod'

/**
 * FRK Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const frkOutwardBaseSchema = {
    date: z.string(),
    partyName: z.string().trim().optional(),
    gunnyPlastic: z
        .number()
        .min(0, 'Gunny plastic cannot be negative')
        .optional(),
    plasticWeight: z
        .number()
        .min(0, 'Plastic weight cannot be negative')
        .optional(),
    truckNo: z.string().trim().optional(),
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

// Create frk outward schema
export const createFrkOutwardSchema = z.object({
    body: z.object({
        ...frkOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update frk outward schema
export const updateFrkOutwardSchema = z.object({
    body: z.object({
        date: frkOutwardBaseSchema.date.optional(),
        partyName: frkOutwardBaseSchema.partyName,
        gunnyPlastic: frkOutwardBaseSchema.gunnyPlastic,
        plasticWeight: frkOutwardBaseSchema.plasticWeight,
        truckNo: frkOutwardBaseSchema.truckNo,
        truckRst: frkOutwardBaseSchema.truckRst,
        truckWeight: frkOutwardBaseSchema.truckWeight,
        gunnyWeight: frkOutwardBaseSchema.gunnyWeight,
        netWeight: frkOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK outward ID is required' }),
    }),
})

// Get frk outward by ID schema
export const getFrkOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK outward ID is required' }),
    }),
})

// Delete frk outward schema
export const deleteFrkOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'FRK outward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFrkOutwardSchema = z.object({
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
export const listFrkOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
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
                'netWeight',
                'truckWeight',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryFrkOutwardSchema = z.object({
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
