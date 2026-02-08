import { z } from 'zod'

/**
 * Govt Gunny Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const govtGunnyOutwardBaseSchema = {
    date: z.string(),
    gunnyDmNumber: z.string().trim().optional(),
    samitiSangrahan: z.string().trim().optional(),
    oldGunnyQty: z
        .number()
        .min(0, 'Old gunny quantity cannot be negative')
        .optional(),
    plasticGunnyQty: z
        .number()
        .min(0, 'Plastic gunny quantity cannot be negative')
        .optional(),
    truckNo: z.string().trim().optional(),
}

// Create govt gunny outward schema
export const createGovtGunnyOutwardSchema = z.object({
    body: z.object({
        ...govtGunnyOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update govt gunny outward schema
export const updateGovtGunnyOutwardSchema = z.object({
    body: z.object({
        date: govtGunnyOutwardBaseSchema.date.optional(),
        gunnyDmNumber: govtGunnyOutwardBaseSchema.gunnyDmNumber,
        samitiSangrahan: govtGunnyOutwardBaseSchema.samitiSangrahan,
        oldGunnyQty: govtGunnyOutwardBaseSchema.oldGunnyQty,
        plasticGunnyQty: govtGunnyOutwardBaseSchema.plasticGunnyQty,
        truckNo: govtGunnyOutwardBaseSchema.truckNo,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt gunny outward ID is required' }),
    }),
})

// Get govt gunny outward by ID schema
export const getGovtGunnyOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt gunny outward ID is required' }),
    }),
})

// Delete govt gunny outward schema
export const deleteGovtGunnyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt gunny outward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteGovtGunnyOutwardSchema = z.object({
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
export const listGovtGunnyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        gunnyDmNumber: z.string().trim().optional(),
        samitiSangrahan: z.string().trim().optional(),
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
                'gunnyDmNumber',
                'samitiSangrahan',
                'oldGunnyQty',
                'plasticGunnyQty',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryGovtGunnyOutwardSchema = z.object({
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
