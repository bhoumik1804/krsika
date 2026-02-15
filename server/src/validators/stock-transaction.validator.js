import { z } from 'zod'

/**
 * Stock Transaction Validators
 */

// Base schema for stock transaction
const stockTransactionBaseSchema = z.object({
    date: z.string().or(z.date()),
    commodity: z.string().min(1, 'Commodity is required').trim(),
    variety: z.string().trim().optional(),
    type: z.enum(['CREDIT', 'DEBIT'], {
        required_error: 'Type must be either CREDIT or DEBIT',
    }),
    action: z.string().min(1, 'Action is required').trim(),
    quantity: z.number().min(0, 'Quantity must be non-negative'),
    bags: z.number().min(0, 'Bags must be non-negative').optional(),
    refModel: z.string().trim().optional(),
    refId: z.string().optional(),
    remarks: z.string().trim().optional(),
})

// Create validator
export const createStockTransactionSchema = z.object({
    body: stockTransactionBaseSchema,
})

// Update validator
export const updateStockTransactionSchema = z.object({
    body: stockTransactionBaseSchema.partial(),
})

// Get by ID validator
export const getStockTransactionByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ID is required'),
    }),
})

// List validator with query params
export const getStockTransactionListSchema = z.object({
    query: z
        .object({
            page: z.string().optional(),
            limit: z.string().optional(),
            commodity: z.string().optional(),
            variety: z.string().optional(),
            type: z.enum(['CREDIT', 'DEBIT']).optional(),
            action: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            sortBy: z.string().optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        })
        .optional(),
})

// Summary validator
export const getStockTransactionSummarySchema = z.object({
    query: z
        .object({
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            commodity: z.string().optional(),
            variety: z.string().optional(),
        })
        .optional(),
})

// Delete validator
export const deleteStockTransactionSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ID is required'),
    }),
})

// Bulk delete validator
export const bulkDeleteStockTransactionsSchema = z.object({
    body: z.object({
        ids: z.array(z.string()).min(1, 'At least one ID is required'),
    }),
})
