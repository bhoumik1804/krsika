import { z } from 'zod'

/**
 * Stock Overview Validators
 * Zod schemas for request validation
 */

// Common fields schema
const stockOverviewBaseSchema = {
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
    vehicleNumber: z
        .string({ required_error: 'Vehicle number is required' })
        .trim()
        .min(1, 'Vehicle number cannot be empty')
        .max(20, 'Vehicle number is too long'),
    bags: z
        .number({ required_error: 'Bags count is required' })
        .int('Bags must be a whole number')
        .min(0, 'Bags cannot be negative'),
    weight: z
        .number({ required_error: 'Weight is required' })
        .min(0, 'Weight cannot be negative'),
    rate: z
        .number({ required_error: 'Rate is required' })
        .min(0, 'Rate cannot be negative'),
    amount: z
        .number({ required_error: 'Amount is required' })
        .min(0, 'Amount cannot be negative'),
    status: z.enum(['pending', 'completed', 'cancelled'], {
        errorMap: () => ({
            message: 'Status must be pending, completed, or cancelled',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create stock overview schema
export const createStockOverviewSchema = z.object({
    body: z.object({
        ...stockOverviewBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update stock overview schema (all fields optional except id)
export const updateStockOverviewSchema = z.object({
    body: z.object({
        date: stockOverviewBaseSchema.date.optional(),
        partyName: stockOverviewBaseSchema.partyName.optional(),
        vehicleNumber: stockOverviewBaseSchema.vehicleNumber.optional(),
        bags: stockOverviewBaseSchema.bags.optional(),
        weight: stockOverviewBaseSchema.weight.optional(),
        rate: stockOverviewBaseSchema.rate.optional(),
        amount: stockOverviewBaseSchema.amount.optional(),
        status: stockOverviewBaseSchema.status.optional(),
        remarks: stockOverviewBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Stock overview ID is required' }),
    }),
})

// Get stock overview by ID schema
export const getStockOverviewByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Stock overview ID is required' }),
    }),
})

// Delete stock overview schema
export const deleteStockOverviewSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Stock overview ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteStockOverviewSchema = z.object({
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
export const listStockOverviewSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z.enum(['pending', 'completed', 'cancelled']).optional(),
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
export const summaryStockOverviewSchema = z.object({
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
