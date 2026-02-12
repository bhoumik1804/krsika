import { z } from 'zod'

/**
 * Other Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const otherOutwardBaseSchema = {
    date: z.string(),
    otherSaleDealNumber: z.string().trim().optional(),
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
    gunnyNew: z.number().min(0, 'Gunny new cannot be negative').optional(),
    gunnyOld: z.number().min(0, 'Gunny old cannot be negative').optional(),
    gunnyPlastic: z
        .number()
        .min(0, 'Gunny plastic cannot be negative')
        .optional(),
    juteGunnyWeight: z
        .number()
        .min(0, 'Jute gunny weight cannot be negative')
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

// Create other outward schema
export const createOtherOutwardSchema = z.object({
    body: z.object({
        ...otherOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update other outward schema
export const updateOtherOutwardSchema = z.object({
    body: z.object({
        date: otherOutwardBaseSchema.date.optional(),
        otherSaleDealNumber: otherOutwardBaseSchema.otherSaleDealNumber,
        itemName: otherOutwardBaseSchema.itemName,
        quantity: otherOutwardBaseSchema.quantity,
        quantityType: otherOutwardBaseSchema.quantityType,
        partyName: otherOutwardBaseSchema.partyName,
        brokerName: otherOutwardBaseSchema.brokerName,
        gunnyNew: otherOutwardBaseSchema.gunnyNew,
        gunnyOld: otherOutwardBaseSchema.gunnyOld,
        gunnyPlastic: otherOutwardBaseSchema.gunnyPlastic,
        juteGunnyWeight: otherOutwardBaseSchema.juteGunnyWeight,
        plasticGunnyWeight: otherOutwardBaseSchema.plasticGunnyWeight,
        truckNo: otherOutwardBaseSchema.truckNo,
        truckRst: otherOutwardBaseSchema.truckRst,
        truckWeight: otherOutwardBaseSchema.truckWeight,
        gunnyWeight: otherOutwardBaseSchema.gunnyWeight,
        netWeight: otherOutwardBaseSchema.netWeight,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other outward ID is required' }),
    }),
})

// Get other outward by ID schema
export const getOtherOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other outward ID is required' }),
    }),
})

// Delete other outward schema
export const deleteOtherOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Other outward ID is required' }),
    }),
})

// Bulk delete other outward schema
export const bulkDeleteOtherOutwardSchema = z.object({
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

// Get other outward list schema
export const getOtherOutwardListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
        partyName: z.string().optional(),
        brokerName: z.string().optional(),
        itemName: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        sortBy: z
            .enum([
                'date',
                'partyName',
                'brokerName',
                'itemName',
                'truckNo',
                'netWeight',
                'createdAt',
            ])
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
})

// Get other outward summary schema
export const getOtherOutwardSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})
