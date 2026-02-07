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
    partyName: z
        .string({ required_error: 'Party name is required' })
        .trim()
        .min(1, 'Party name cannot be empty')
        .max(200, 'Party name is too long'),
    receiptMode: z
        .enum(['Cash', 'Bank', 'Cheque', 'UPI'], {
            errorMap: () => ({
                message: 'Receipt mode must be Cash, Bank, Cheque, or UPI',
            }),
        })
        .optional(),
    bank: z.string().trim().max(200, 'Bank name is too long').optional(),
    amount: z
        .number({ required_error: 'Amount is required' })
        .min(0, 'Amount cannot be negative'),
    narration: z.string().trim().max(500, 'Narration is too long').optional(),
    accountHead: z
        .string()
        .trim()
        .max(200, 'Account head is too long')
        .optional(),
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

// Update financial receipt schema (all fields optional except id)
export const updateFinancialReceiptSchema = z.object({
    body: z.object({
        date: financialReceiptBaseSchema.date.optional(),
        partyName: financialReceiptBaseSchema.partyName.optional(),
        receiptMode: financialReceiptBaseSchema.receiptMode,
        bank: financialReceiptBaseSchema.bank,
        amount: financialReceiptBaseSchema.amount.optional(),
        narration: financialReceiptBaseSchema.narration,
        accountHead: financialReceiptBaseSchema.accountHead,
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
        receiptMode: z.enum(['Cash', 'Bank', 'Cheque', 'UPI']).optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'partyName', 'amount', 'createdAt'])
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
