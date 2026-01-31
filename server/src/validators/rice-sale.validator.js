import { z } from 'zod'

/**
 * Rice Sale Validators
 * Zod schemas for request validation
 */

// Common fields schema
const riceSaleBaseSchema = {
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
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    deliveryType: z
        .string()
        .trim()
        .max(100, 'Delivery type is too long')
        .optional(),
    lotOrOther: z
        .string()
        .trim()
        .max(100, 'Lot or other is too long')
        .optional(),
    fciOrNAN: z.string().trim().max(100, 'FCI or NAN is too long').optional(),
    riceType: z.string().trim().max(100, 'Rice type is too long').optional(),
    riceQty: z.number().min(0, 'Rice quantity cannot be negative').optional(),
    riceRatePerQuintal: z
        .number()
        .min(0, 'Rice rate per quintal cannot be negative')
        .optional(),
    discountPercent: z
        .number()
        .min(0, 'Discount percent cannot be negative')
        .max(100, 'Discount percent cannot exceed 100')
        .optional(),
    brokeragePerQuintal: z
        .number()
        .min(0, 'Brokerage per quintal cannot be negative')
        .optional(),
    gunnyType: z.string().trim().max(100, 'Gunny type is too long').optional(),
    newGunnyRate: z
        .number()
        .min(0, 'New gunny rate cannot be negative')
        .optional(),
    oldGunnyRate: z
        .number()
        .min(0, 'Old gunny rate cannot be negative')
        .optional(),
    plasticGunnyRate: z
        .number()
        .min(0, 'Plastic gunny rate cannot be negative')
        .optional(),
    frkType: z.string().trim().max(100, 'FRK type is too long').optional(),
    frkRatePerQuintal: z
        .number()
        .min(0, 'FRK rate per quintal cannot be negative')
        .optional(),
    lotNumber: z.string().trim().max(100, 'Lot number is too long').optional(),
}

// Create rice sale schema
export const createRiceSaleSchema = z.object({
    body: z.object({
        ...riceSaleBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update rice sale schema (all fields optional except id)
export const updateRiceSaleSchema = z.object({
    body: z.object({
        date: riceSaleBaseSchema.date.optional(),
        partyName: riceSaleBaseSchema.partyName,
        brokerName: riceSaleBaseSchema.brokerName,
        deliveryType: riceSaleBaseSchema.deliveryType,
        lotOrOther: riceSaleBaseSchema.lotOrOther,
        fciOrNAN: riceSaleBaseSchema.fciOrNAN,
        riceType: riceSaleBaseSchema.riceType,
        riceQty: riceSaleBaseSchema.riceQty,
        riceRatePerQuintal: riceSaleBaseSchema.riceRatePerQuintal,
        discountPercent: riceSaleBaseSchema.discountPercent,
        brokeragePerQuintal: riceSaleBaseSchema.brokeragePerQuintal,
        gunnyType: riceSaleBaseSchema.gunnyType,
        newGunnyRate: riceSaleBaseSchema.newGunnyRate,
        oldGunnyRate: riceSaleBaseSchema.oldGunnyRate,
        plasticGunnyRate: riceSaleBaseSchema.plasticGunnyRate,
        frkType: riceSaleBaseSchema.frkType,
        frkRatePerQuintal: riceSaleBaseSchema.frkRatePerQuintal,
        lotNumber: riceSaleBaseSchema.lotNumber,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice sale ID is required' }),
    }),
})

// Get rice sale by ID schema
export const getRiceSaleByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice sale ID is required' }),
    }),
})

// Delete rice sale schema
export const deleteRiceSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Rice sale ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteRiceSaleSchema = z.object({
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
export const listRiceSaleSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        brokerName: z.string().trim().optional(),
        deliveryType: z.string().trim().optional(),
        lotOrOther: z.string().trim().optional(),
        fciOrNAN: z.string().trim().optional(),
        riceType: z.string().trim().optional(),
        gunnyType: z.string().trim().optional(),
        frkType: z.string().trim().optional(),
        lotNumber: z.string().trim().optional(),
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
                'riceType',
                'riceQty',
                'riceRatePerQuintal',
                'lotNumber',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryRiceSaleSchema = z.object({
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
