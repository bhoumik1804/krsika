import { z } from 'zod'

/**
 * Financial Payment Validators
 * Zod schemas for request validation
 */

// Common fields schema
const financialPaymentBaseSchema = {
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
    paymentType: z.string().trim().optional(),
    partyName: z.string().trim().optional().nullable(),
    brokerName: z.string().trim().optional().nullable(),
    purchaseDealType: z.string().trim().optional().nullable(),
    purchaseDealNumber: z.string().trim().optional().nullable(),
    transporterName: z.string().trim().optional().nullable(),
    truckNumber: z.string().trim().optional().nullable(),
    diesel: z.number().min(0).optional(),
    bhatta: z.number().min(0).optional(),
    repairOrMaintenance: z.number().min(0).optional(),
    labourType: z.string().trim().optional().nullable(),
    labourGroupName: z.string().trim().optional().nullable(),
    staffName: z.string().trim().optional().nullable(),
    salary: z.number().min(0).optional(),
    month: z.string().trim().optional().nullable(),
    attendance: z.number().min(0).optional(),
    allowedLeave: z.number().min(0).optional(),
    payableSalary: z.number().min(0).optional(),
    salaryPayment: z.number().min(0).optional(),
    advancePayment: z.number().min(0).optional(),
    remarks: z.string().trim().optional().nullable(),
    paymentAmount: z.number().min(0).optional(),
}

// Create financial payment schema
export const createFinancialPaymentSchema = z.object({
    body: z.object({
        ...financialPaymentBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update financial payment schema
export const updateFinancialPaymentSchema = z.object({
    body: z.object({
        ...financialPaymentBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Financial payment ID is required' }),
    }),
})

// Get financial payment by ID schema
export const getFinancialPaymentByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Financial payment ID is required' }),
    }),
})

// Delete financial payment schema
export const deleteFinancialPaymentSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Financial payment ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteFinancialPaymentSchema = z.object({
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
export const listFinancialPaymentSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        paymentType: z.string().optional(),
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
            .enum(['date', 'partyName', 'paymentAmount', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryFinancialPaymentSchema = z.object({
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
