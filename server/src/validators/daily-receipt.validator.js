import { z } from 'zod'

/**
 * Daily Receipt Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailyReceiptBaseSchema = {
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
    voucherNumber: z
        .string({ required_error: 'Voucher number is required' })
        .trim()
        .min(1, 'Voucher number cannot be empty')
        .max(50, 'Voucher number is too long'),
    partyName: z
        .string({ required_error: 'Party name is required' })
        .trim()
        .min(1, 'Party name cannot be empty')
        .max(200, 'Party name is too long'),
    amount: z
        .number({ required_error: 'Amount is required' })
        .min(0, 'Amount cannot be negative'),
    paymentMode: z.enum(['Cash', 'Bank', 'Cheque', 'UPI'], {
        errorMap: () => ({
            message: 'Payment mode must be Cash, Bank, Cheque, or UPI',
        }),
    }),
    purpose: z
        .string({ required_error: 'Purpose is required' })
        .trim()
        .min(1, 'Purpose cannot be empty')
        .max(500, 'Purpose is too long'),
    status: z.enum(['pending', 'cleared', 'cancelled', 'bounced'], {
        errorMap: () => ({
            message: 'Status must be pending, cleared, cancelled, or bounced',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily receipt schema
export const createDailyReceiptSchema = z.object({
    body: z.object({
        ...dailyReceiptBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily receipt schema (all fields optional except id)
export const updateDailyReceiptSchema = z.object({
    body: z.object({
        date: dailyReceiptBaseSchema.date.optional(),
        voucherNumber: dailyReceiptBaseSchema.voucherNumber.optional(),
        partyName: dailyReceiptBaseSchema.partyName.optional(),
        amount: dailyReceiptBaseSchema.amount.optional(),
        paymentMode: dailyReceiptBaseSchema.paymentMode.optional(),
        purpose: dailyReceiptBaseSchema.purpose.optional(),
        status: dailyReceiptBaseSchema.status.optional(),
        remarks: dailyReceiptBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily receipt ID is required' }),
    }),
})

// Get daily receipt by ID schema
export const getDailyReceiptByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily receipt ID is required' }),
    }),
})

// Delete daily receipt schema
export const deleteDailyReceiptSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily receipt ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailyReceiptSchema = z.object({
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
export const listDailyReceiptSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z
            .enum(['pending', 'cleared', 'cancelled', 'bounced'])
            .optional(),
        paymentMode: z.enum(['Cash', 'Bank', 'Cheque', 'UPI']).optional(),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
            .optional(),
        sortBy: z
            .enum(['date', 'partyName', 'voucherNumber', 'amount', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryDailyReceiptSchema = z.object({
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
