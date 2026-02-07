import { z } from 'zod'

/**
 * Govt Rice Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const govtRiceOutwardBaseSchema = {
    date: z
        .string({
            required_error: 'Date is required',
        })
        .datetime({ offset: true })
        .or(
            z
                .string()
                .regex(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'Invalid date format (YYYY-MM-DD)'
                )
        ),
    lotNo: z.string().trim().max(100, 'Lot number is too long').optional(),
    fciNan: z.string().trim().max(100, 'FCI NAN is too long').optional(),
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    gunnyNew: z
        .number()
        .int('Gunny new must be a whole number')
        .min(0, 'Gunny new cannot be negative')
        .optional(),
    gunnyOld: z
        .number()
        .int('Gunny old must be a whole number')
        .min(0, 'Gunny old cannot be negative')
        .optional(),
    juteWeight: z.number().min(0, 'Jute weight cannot be negative').optional(),
    truckNo: z.string().trim().max(20, 'Truck number is too long').optional(),
    truckRst: z.string().trim().max(50, 'Truck RST is too long').optional(),
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

// Create govt rice outward schema
export const createGovtRiceOutwardSchema = z.object({
    body: z.object({
        ...govtRiceOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update govt rice outward schema (all fields optional except id)
export const updateGovtRiceOutwardSchema = z.object({
    body: z.object({
        date: govtRiceOutwardBaseSchema.date.optional(),
        lotNo: govtRiceOutwardBaseSchema.lotNo,
        fciNan: govtRiceOutwardBaseSchema.fciNan,
        riceType: govtRiceOutwardBaseSchema.riceType,
        gunnyNew: govtRiceOutwardBaseSchema.gunnyNew,
        gunnyOld: govtRiceOutwardBaseSchema.gunnyOld,
        juteWeight: govtRiceOutwardBaseSchema.juteWeight,
        truckNo: govtRiceOutwardBaseSchema.truckNo,
        truckRst: govtRiceOutwardBaseSchema.truckRst,
        truckWeight: govtRiceOutwardBaseSchema.truckWeight,
        gunnyWeight: govtRiceOutwardBaseSchema.gunnyWeight,
        netWeight: govtRiceOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt rice outward ID is required' }),
    }),
})

// Get govt rice outward by ID schema
export const getGovtRiceOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt rice outward ID is required' }),
    }),
})

// Delete govt rice outward schema
export const deleteGovtRiceOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt rice outward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteGovtRiceOutwardSchema = z.object({
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
export const listGovtRiceOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        riceType: z.string().trim().optional(),
        lotNo: z.string().trim().optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'lotNo', 'riceType', 'netWeight', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryGovtRiceOutwardSchema = z.object({
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
