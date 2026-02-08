import { z } from 'zod'

/**
 * Private Gunny Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const privateGunnyOutwardBaseSchema = {
    date: z.string(),
    gunnyPurchaseDealNumber: z.string().trim().optional(),
    partyName: z.string().trim().optional(),
    newGunnyQty: z
        .number()
        .min(0, 'New gunny quantity cannot be negative')
        .optional(),
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

// Create private gunny outward schema
export const createPrivateGunnyOutwardSchema = z.object({
    body: z.object({
        ...privateGunnyOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update private gunny outward schema
export const updatePrivateGunnyOutwardSchema = z.object({
    body: z.object({
        date: privateGunnyOutwardBaseSchema.date.optional(),
        gunnyPurchaseDealNumber:
            privateGunnyOutwardBaseSchema.gunnyPurchaseDealNumber,
        partyName: privateGunnyOutwardBaseSchema.partyName,
        newGunnyQty: privateGunnyOutwardBaseSchema.newGunnyQty,
        oldGunnyQty: privateGunnyOutwardBaseSchema.oldGunnyQty,
        plasticGunnyQty: privateGunnyOutwardBaseSchema.plasticGunnyQty,
        truckNo: privateGunnyOutwardBaseSchema.truckNo,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Private gunny outward ID is required',
        }),
    }),
})

// Get private gunny outward by ID schema
export const getPrivateGunnyOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Private gunny outward ID is required',
        }),
    }),
})

// Delete private gunny outward schema
export const deletePrivateGunnyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({
            required_error: 'Private gunny outward ID is required',
        }),
    }),
})

// Bulk delete schema
export const bulkDeletePrivateGunnyOutwardSchema = z.object({
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
export const listPrivateGunnyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        gunnyPurchaseDealNumber: z.string().trim().optional(),
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
                'gunnyPurchaseDealNumber',
                'newGunnyQty',
                'oldGunnyQty',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryPrivateGunnyOutwardSchema = z.object({
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
