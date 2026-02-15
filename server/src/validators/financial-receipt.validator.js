import { z } from 'zod'

/**
 * Financial Receipt Validators
 * Zod schemas for request validation
 */

// Common fields schema
const financialReceiptBaseSchema = {
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
    partyName: z.string().trim().optional().nullable(),
    brokerName: z.string().trim().optional().nullable(),
    salesDealType: z.string().trim().optional().nullable(),
    salesDealNumber: z.string().trim().optional().nullable(),
    receivedAmount: z.number().min(0).optional(),
    remarks: z.string().trim().optional().nullable(),
}

// Create financial receipt schema
export const createFinancialReceiptSchema = z.object({
    body: z.object({
        ...financialReceiptBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update financial receipt schema
export const updateFinancialReceiptSchema = z.object({
    body: z.object({
        ...financialReceiptBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Financial receipt ID is required' }),
    }),
})

// Get financial receipt by ID schema
export const getFinancialReceiptByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Financial receipt ID is required' }),
    }),
})

// Delete financial receipt schema
export const deleteFinancialReceiptSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Financial receipt ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFinancialReceiptSchema = z.object({
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
export const listFinancialReceiptSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        salesDealType: z.string().optional(),
        partyName: z.string().optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'partyName', 'receivedAmount', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryFinancialReceiptSchema = z.object({
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
