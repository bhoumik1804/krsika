import { z } from 'zod'

/**
 * Daily Sales Deal Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailySalesDealBaseSchema = {
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
    buyerName: z
        .string({ required_error: 'Buyer name is required' })
        .trim()
        .min(1, 'Buyer name cannot be empty')
        .max(200, 'Buyer name is too long'),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    brokerCommission: z
        .number()
        .min(0, 'Broker commission cannot be negative')
        .optional(),
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
    transporterName: z
        .string()
        .trim()
        .max(200, 'Transporter name is too long')
        .optional(),
    freightAmount: z
        .number()
        .min(0, 'Freight amount cannot be negative')
        .optional(),
    advanceReceived: z
        .number()
        .min(0, 'Advance received cannot be negative')
        .optional(),
    balanceAmount: z
        .number()
        .min(0, 'Balance amount cannot be negative')
        .optional(),
    paymentStatus: z.enum(['pending', 'partial', 'received', 'cancelled'], {
        errorMap: () => ({
            message:
                'Payment status must be pending, partial, received, or cancelled',
        }),
    }),
    status: z.enum(['open', 'dispatched', 'delivered', 'closed', 'cancelled'], {
        errorMap: () => ({
            message:
                'Status must be open, dispatched, delivered, closed, or cancelled',
        }),
    }),
    paymentTerms: z
        .string()
        .trim()
        .max(500, 'Payment terms is too long')
        .optional(),
    deliveryAddress: z
        .string()
        .trim()
        .max(500, 'Delivery address is too long')
        .optional(),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily sales deal schema
export const createDailySalesDealSchema = z.object({
    body: z.object({
        ...dailySalesDealBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily sales deal schema (all fields optional except id)
export const updateDailySalesDealSchema = z.object({
    body: z.object({
        date: dailySalesDealBaseSchema.date.optional(),
        buyerName: dailySalesDealBaseSchema.buyerName.optional(),
        brokerName: dailySalesDealBaseSchema.brokerName,
        brokerCommission: dailySalesDealBaseSchema.brokerCommission,
        commodity: dailySalesDealBaseSchema.commodity.optional(),
        commodityType: dailySalesDealBaseSchema.commodityType,
        quantity: dailySalesDealBaseSchema.quantity.optional(),
        unit: dailySalesDealBaseSchema.unit.optional(),
        rate: dailySalesDealBaseSchema.rate.optional(),
        totalAmount: dailySalesDealBaseSchema.totalAmount.optional(),
        vehicleNumber: dailySalesDealBaseSchema.vehicleNumber,
        transporterName: dailySalesDealBaseSchema.transporterName,
        freightAmount: dailySalesDealBaseSchema.freightAmount,
        advanceReceived: dailySalesDealBaseSchema.advanceReceived,
        balanceAmount: dailySalesDealBaseSchema.balanceAmount,
        paymentStatus: dailySalesDealBaseSchema.paymentStatus.optional(),
        status: dailySalesDealBaseSchema.status.optional(),
        paymentTerms: dailySalesDealBaseSchema.paymentTerms,
        deliveryAddress: dailySalesDealBaseSchema.deliveryAddress,
        remarks: dailySalesDealBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily sales deal ID is required' }),
    }),
})

// Get daily sales deal by ID schema
export const getDailySalesDealByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily sales deal ID is required' }),
    }),
})

// Delete daily sales deal schema
export const deleteDailySalesDealSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily sales deal ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailySalesDealSchema = z.object({
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
export const listDailySalesDealSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        paymentStatus: z
            .enum(['pending', 'partial', 'received', 'cancelled'])
            .optional(),
        status: z
            .enum(['open', 'dispatched', 'delivered', 'closed', 'cancelled'])
            .optional(),
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
                'buyerName',
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
export const summaryDailySalesDealSchema = z.object({
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
