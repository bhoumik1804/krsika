import { z } from 'zod'

/**
 * DO Report Validators
 * Zod schemas for request validation
 */

// Common fields schema
const doReportBaseSchema = {
    doNumber: z
        .string({ required_error: 'DO number is required' })
        .trim()
        .min(1, 'DO number cannot be empty')
        .max(100, 'DO number is too long'),
    date: z
        .string({ required_error: 'Date is required' })
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    itemType: z.string().trim().max(100, 'Item type is too long').optional(),
    quantity: z.coerce
        .number()
        .min(0, 'Quantity cannot be negative')
        .optional(),
    validFrom: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
    validTo: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
}

// Create DO report schema
export const createDoReportSchema = z.object({
    body: z.object({
        ...doReportBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update DO report schema
export const updateDoReportSchema = z.object({
    body: z.object({
        doNumber: doReportBaseSchema.doNumber.optional(),
        date: z
            .string()
            .refine(
                (val) => !val || !isNaN(Date.parse(val)),
                'Invalid date format'
            )
            .optional(),
        partyName: doReportBaseSchema.partyName,
        itemType: doReportBaseSchema.itemType,
        quantity: doReportBaseSchema.quantity,
        validFrom: doReportBaseSchema.validFrom,
        validTo: doReportBaseSchema.validTo,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'DO Report ID is required' }),
    }),
})

// Get DO report by ID schema
export const getDoReportByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'DO Report ID is required' }),
    }),
})

// Delete DO report schema
export const deleteDoReportSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'DO Report ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDoReportSchema = z.object({
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
export const getDoReportListSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(['doNumber', 'date', 'partyName', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const getDoReportSummarySchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})
