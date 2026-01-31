import { z } from 'zod'

/**
 * Daily Purchase Deal Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailyPurchaseDealBaseSchema = {
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
    farmerName: z
        .string({ required_error: 'Farmer name is required' })
        .trim()
        .min(1, 'Farmer name cannot be empty')
        .max(200, 'Farmer name is too long'),
    commodity: z
        .string({ required_error: 'Commodity is required' })
        .trim()
        .min(1, 'Commodity cannot be empty')
        .max(200, 'Commodity name is too long'),
    commodityType: z
        .string()
        .trim()
        .max(100, 'Commodity type is too long')
        .optional(),
    quantity: z
        .number({ required_error: 'Quantity is required' })
        .min(0, 'Quantity cannot be negative'),
    unit: z
        .string({ required_error: 'Unit is required' })
        .trim()
        .min(1, 'Unit cannot be empty')
        .max(50, 'Unit is too long'),
    rate: z
        .number({ required_error: 'Rate is required' })
        .min(0, 'Rate cannot be negative'),
    totalAmount: z
        .number({ required_error: 'Total amount is required' })
        .min(0, 'Total amount cannot be negative'),
    vehicleNumber: z
        .string()
        .trim()
        .max(20, 'Vehicle number is too long')
        .optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    brokerCommission: z
        .number()
        .min(0, 'Broker commission cannot be negative')
        .optional(),
    advanceAmount: z
        .number()
        .min(0, 'Advance amount cannot be negative')
        .optional(),
    balanceAmount: z
        .number()
        .min(0, 'Balance amount cannot be negative')
        .optional(),
    paymentStatus: z.enum(['pending', 'partial', 'paid', 'cancelled'], {
        errorMap: () => ({
            message:
                'Payment status must be pending, partial, paid, or cancelled',
        }),
    }),
    status: z.enum(['open', 'closed', 'cancelled'], {
        errorMap: () => ({
            message: 'Status must be open, closed, or cancelled',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily purchase deal schema
export const createDailyPurchaseDealSchema = z.object({
    body: z.object({
        ...dailyPurchaseDealBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily purchase deal schema (all fields optional except id)
export const updateDailyPurchaseDealSchema = z.object({
    body: z.object({
        date: dailyPurchaseDealBaseSchema.date.optional(),
        farmerName: dailyPurchaseDealBaseSchema.farmerName.optional(),
        commodity: dailyPurchaseDealBaseSchema.commodity.optional(),
        commodityType: dailyPurchaseDealBaseSchema.commodityType,
        quantity: dailyPurchaseDealBaseSchema.quantity.optional(),
        unit: dailyPurchaseDealBaseSchema.unit.optional(),
        rate: dailyPurchaseDealBaseSchema.rate.optional(),
        totalAmount: dailyPurchaseDealBaseSchema.totalAmount.optional(),
        vehicleNumber: dailyPurchaseDealBaseSchema.vehicleNumber,
        brokerName: dailyPurchaseDealBaseSchema.brokerName,
        brokerCommission: dailyPurchaseDealBaseSchema.brokerCommission,
        advanceAmount: dailyPurchaseDealBaseSchema.advanceAmount,
        balanceAmount: dailyPurchaseDealBaseSchema.balanceAmount,
        paymentStatus: dailyPurchaseDealBaseSchema.paymentStatus.optional(),
        status: dailyPurchaseDealBaseSchema.status.optional(),
        remarks: dailyPurchaseDealBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily purchase deal ID is required' }),
    }),
})

// Get daily purchase deal by ID schema
export const getDailyPurchaseDealByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily purchase deal ID is required' }),
    }),
})

// Delete daily purchase deal schema
export const deleteDailyPurchaseDealSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily purchase deal ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailyPurchaseDealSchema = z.object({
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
export const listDailyPurchaseDealSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        paymentStatus: z
            .enum(['pending', 'partial', 'paid', 'cancelled'])
            .optional(),
        status: z.enum(['open', 'closed', 'cancelled']).optional(),
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
                'farmerName',
                'commodity',
                'totalAmount',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryDailyPurchaseDealSchema = z.object({
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
