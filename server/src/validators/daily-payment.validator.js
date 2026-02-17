import { z } from 'zod'

/**
 * Daily Payment Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailyPaymentBaseSchema = {
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
    referenceNumber: z
        .string()
        .trim()
        .max(100, 'Reference number is too long')
        .optional(),
    status: z.enum(['pending', 'completed', 'cancelled', 'failed'], {
        errorMap: () => ({
            message: 'Status must be pending, completed, cancelled, or failed',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily payment schema
export const createDailyPaymentSchema = z.object({
    body: z.object({
        ...dailyPaymentBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily payment schema (all fields optional except id)
export const updateDailyPaymentSchema = z.object({
    body: z.object({
        date: dailyPaymentBaseSchema.date.optional(),
        voucherNumber: dailyPaymentBaseSchema.voucherNumber.optional(),
        partyName: dailyPaymentBaseSchema.partyName.optional(),
        amount: dailyPaymentBaseSchema.amount.optional(),
        paymentMode: dailyPaymentBaseSchema.paymentMode.optional(),
        purpose: dailyPaymentBaseSchema.purpose.optional(),
        referenceNumber: dailyPaymentBaseSchema.referenceNumber,
        status: dailyPaymentBaseSchema.status.optional(),
        remarks: dailyPaymentBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily payment ID is required' }),
    }),
})

// Get daily payment by ID schema
export const getDailyPaymentByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily payment ID is required' }),
    }),
})

// Delete daily payment schema
export const deleteDailyPaymentSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily payment ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailyPaymentSchema = z.object({
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
export const listDailyPaymentSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(1000).default(10).optional(),
        search: z.string().trim().optional(),
        status: z
            .enum(['pending', 'completed', 'cancelled', 'failed'])
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
export const summaryDailyPaymentSchema = z.object({
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
