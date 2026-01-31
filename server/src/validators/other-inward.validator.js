import { z } from 'zod'

/**
 * Other Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const otherInwardBaseSchema = {
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
    partyName: z
        .string({
            required_error: 'Party name is required',
        })
        .trim()
        .min(1, 'Party name is required')
        .max(200, 'Party name is too long'),
    itemName: z.string().trim().max(200, 'Item name is too long').optional(),
    quantity: z.number().min(0, 'Quantity cannot be negative').optional(),
    unit: z.string().trim().max(50, 'Unit is too long').optional(),
    rate: z.number().min(0, 'Rate cannot be negative').optional(),
    amount: z.number().min(0, 'Amount cannot be negative').optional(),
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

// Update other inward schema (all fields optional except id)
export const updateOtherInwardSchema = z.object({
    body: z.object({
        date: otherInwardBaseSchema.date.optional(),
        partyName: z
            .string()
            .trim()
            .max(200, 'Party name is too long')
            .optional(),
        itemName: otherInwardBaseSchema.itemName,
        quantity: otherInwardBaseSchema.quantity,
        unit: otherInwardBaseSchema.unit,
        rate: otherInwardBaseSchema.rate,
        amount: otherInwardBaseSchema.amount,
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
export const listOtherInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        itemName: z.string().trim().optional(),
        unit: z.string().trim().optional(),
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
                'itemName',
                'quantity',
                'amount',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryOtherInwardSchema = z.object({
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
