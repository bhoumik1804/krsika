import { z } from 'zod'

/**
 * Paddy Purchase Validators
 * Zod schemas for request validation
 */

// Common fields schema
const paddyPurchaseBaseSchema = {
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
    purchaseType: z
        .string()
        .trim()
        .max(100, 'Purchase type is too long')
        .optional(),
    doNumber: z.string().trim().max(100, 'DO number is too long').optional(),
    committeeName: z
        .string()
        .trim()
        .max(200, 'Committee name is too long')
        .optional(),
    doPaddyQty: z
        .number()
        .min(0, 'DO paddy quantity cannot be negative')
        .optional(),
    paddyType: z.string().trim().max(100, 'Paddy type is too long').optional(),
    totalPaddyQty: z
        .number()
        .min(0, 'Total paddy quantity cannot be negative')
        .optional(),
    paddyRatePerQuintal: z
        .number()
        .min(0, 'Paddy rate per quintal cannot be negative')
        .optional(),
    discountPercent: z
        .number()
        .min(0, 'Discount percent cannot be negative')
        .max(100, 'Discount percent cannot exceed 100')
        .optional(),
    brokerage: z.number().min(0, 'Brokerage cannot be negative').optional(),
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
}

// Create paddy purchase schema
export const createPaddyPurchaseSchema = z.object({
    body: z.object({
        ...paddyPurchaseBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update paddy purchase schema (all fields optional except id)
export const updatePaddyPurchaseSchema = z.object({
    body: z.object({
        date: paddyPurchaseBaseSchema.date.optional(),
        partyName: paddyPurchaseBaseSchema.partyName,
        brokerName: paddyPurchaseBaseSchema.brokerName,
        deliveryType: paddyPurchaseBaseSchema.deliveryType,
        purchaseType: paddyPurchaseBaseSchema.purchaseType,
        doNumber: paddyPurchaseBaseSchema.doNumber,
        committeeName: paddyPurchaseBaseSchema.committeeName,
        doPaddyQty: paddyPurchaseBaseSchema.doPaddyQty,
        paddyType: paddyPurchaseBaseSchema.paddyType,
        totalPaddyQty: paddyPurchaseBaseSchema.totalPaddyQty,
        paddyRatePerQuintal: paddyPurchaseBaseSchema.paddyRatePerQuintal,
        discountPercent: paddyPurchaseBaseSchema.discountPercent,
        brokerage: paddyPurchaseBaseSchema.brokerage,
        gunnyType: paddyPurchaseBaseSchema.gunnyType,
        newGunnyRate: paddyPurchaseBaseSchema.newGunnyRate,
        oldGunnyRate: paddyPurchaseBaseSchema.oldGunnyRate,
        plasticGunnyRate: paddyPurchaseBaseSchema.plasticGunnyRate,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Paddy purchase ID is required' }),
    }),
})

// Get paddy purchase by ID schema
export const getPaddyPurchaseByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Paddy purchase ID is required' }),
    }),
})

// Delete paddy purchase schema
export const deletePaddyPurchaseSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Paddy purchase ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeletePaddyPurchaseSchema = z.object({
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
export const listPaddyPurchaseSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        purchaseType: z.string().trim().optional(),
        deliveryType: z.string().trim().optional(),
        paddyType: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        brokerName: z.string().trim().optional(),
        committeeName: z.string().trim().optional(),
        gunnyType: z.string().trim().optional(),
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
                'paddyType',
                'purchaseType',
                'totalPaddyQty',
                'paddyRatePerQuintal',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryPaddyPurchaseSchema = z.object({
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
