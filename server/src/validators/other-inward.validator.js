import { z } from 'zod'

/**
 * Other Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const otherInwardBaseSchema = {
    date: z.string(),
    otherPurchaseDealNumber: z
        .string()
        .trim()
        .max(100, 'Other purchase deal number is too long')
        .optional(),
    itemName: z.string().trim().max(200, 'Item name is too long').optional(),
    quantity: z.number().min(0, 'Quantity cannot be negative').optional(),
    quantityType: z
        .string()
        .trim()
        .max(50, 'Quantity type is too long')
        .optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    gunnyNew: z.number().min(0, 'Cannot be negative').optional(),
    gunnyOld: z.number().min(0, 'Cannot be negative').optional(),
    gunnyPlastic: z.number().min(0, 'Cannot be negative').optional(),
    juteGunnyWeight: z.number().min(0, 'Cannot be negative').optional(),
    plasticGunnyWeight: z.number().min(0, 'Cannot be negative').optional(),
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

// Create other inward schema
export const createOtherInwardSchema = z.object({
    body: z.object({
        ...otherInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update other inward schema
export const updateOtherInwardSchema = z.object({
    body: z.object({
        date: otherInwardBaseSchema.date.optional(),
        otherPurchaseDealNumber: otherInwardBaseSchema.otherPurchaseDealNumber,
        itemName: otherInwardBaseSchema.itemName,
        quantity: otherInwardBaseSchema.quantity,
        quantityType: otherInwardBaseSchema.quantityType,
        partyName: otherInwardBaseSchema.partyName,
        brokerName: otherInwardBaseSchema.brokerName,
        gunnyNew: otherInwardBaseSchema.gunnyNew,
        gunnyOld: otherInwardBaseSchema.gunnyOld,
        gunnyPlastic: otherInwardBaseSchema.gunnyPlastic,
        juteGunnyWeight: otherInwardBaseSchema.juteGunnyWeight,
        plasticGunnyWeight: otherInwardBaseSchema.plasticGunnyWeight,
        truckNumber: otherInwardBaseSchema.truckNumber,
        rstNumber: otherInwardBaseSchema.rstNumber,
        truckWeight: otherInwardBaseSchema.truckWeight,
        gunnyWeight: otherInwardBaseSchema.gunnyWeight,
        netWeight: otherInwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other inward ID is required' }),
    }),
})

// Get other inward by ID schema
export const getOtherInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other inward ID is required' }),
    }),
})

// Delete other inward schema
export const deleteOtherInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteOtherInwardSchema = z.object({
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
export const getOtherInwardListSchema = z.object({
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
            .enum(['date', 'partyName', 'itemName', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getOtherInwardSummarySchema = z.object({
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
