import { z } from 'zod'

/**
 * Broker Transaction Validators
 * Zod schemas for request validation
 */

// Common fields schema
const brokerTransactionBaseSchema = {
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
    brokerName: z
        .string({ required_error: 'Broker name is required' })
        .trim()
        .min(1, 'Broker name cannot be empty')
        .max(200, 'Broker name is too long'),
    transactionType: z
        .string({ required_error: 'Transaction type is required' })
        .trim()
        .min(1, 'Transaction type cannot be empty')
        .max(100, 'Transaction type is too long'),
    debit: z.number().min(0, 'Debit cannot be negative').optional(),
    credit: z.number().min(0, 'Credit cannot be negative').optional(),
    balance: z.number().optional(),
    narration: z.string().trim().max(500, 'Narration is too long').optional(),
}

// Create broker transaction schema
export const createBrokerTransactionSchema = z.object({
    body: z.object({
        ...brokerTransactionBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update broker transaction schema (all fields optional except id)
export const updateBrokerTransactionSchema = z.object({
    body: z.object({
        date: brokerTransactionBaseSchema.date.optional(),
        brokerName: brokerTransactionBaseSchema.brokerName.optional(),
        transactionType: brokerTransactionBaseSchema.transactionType.optional(),
        debit: brokerTransactionBaseSchema.debit,
        credit: brokerTransactionBaseSchema.credit,
        balance: brokerTransactionBaseSchema.balance,
        narration: brokerTransactionBaseSchema.narration,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Broker transaction ID is required' }),
    }),
})

// Get broker transaction by ID schema
export const getBrokerTransactionByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Broker transaction ID is required' }),
    }),
})

// Delete broker transaction schema
export const deleteBrokerTransactionSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Broker transaction ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteBrokerTransactionSchema = z.object({
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
export const listBrokerTransactionSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        transactionType: z.string().trim().optional(),
        brokerName: z.string().trim().optional(),
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
                'brokerName',
                'transactionType',
                'debit',
                'credit',
                'balance',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryBrokerTransactionSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        brokerName: z.string().trim().optional(),
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
