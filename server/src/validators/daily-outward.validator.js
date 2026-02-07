import { z } from 'zod'

/**
 * Daily Outward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailyOutwardBaseSchema = {
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
    gatePassNumber: z
        .string({ required_error: 'Gate pass number is required' })
        .trim()
        .min(1, 'Gate pass number cannot be empty')
        .max(50, 'Gate pass number is too long'),
    partyName: z
        .string({ required_error: 'Party name is required' })
        .trim()
        .min(1, 'Party name cannot be empty')
        .max(200, 'Party name is too long'),
    item: z
        .string({ required_error: 'Item is required' })
        .trim()
        .min(1, 'Item cannot be empty')
        .max(200, 'Item name is too long'),
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
    driverName: z
        .string()
        .trim()
        .max(100, 'Driver name is too long')
        .optional(),
    status: z.enum(['pending', 'completed', 'dispatched', 'cancelled'], {
        errorMap: () => ({
            message:
                'Status must be pending, completed, dispatched, or cancelled',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily outward schema
export const createDailyOutwardSchema = z.object({
    body: z.object({
        ...dailyOutwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily outward schema (all fields optional except id)
export const updateDailyOutwardSchema = z.object({
    body: z.object({
        date: dailyOutwardBaseSchema.date.optional(),
        gatePassNumber: dailyOutwardBaseSchema.gatePassNumber.optional(),
        partyName: dailyOutwardBaseSchema.partyName.optional(),
        item: dailyOutwardBaseSchema.item.optional(),
        vehicleNumber: dailyOutwardBaseSchema.vehicleNumber.optional(),
        bags: dailyOutwardBaseSchema.bags.optional(),
        weight: dailyOutwardBaseSchema.weight.optional(),
        driverName: dailyOutwardBaseSchema.driverName,
        status: dailyOutwardBaseSchema.status.optional(),
        remarks: dailyOutwardBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily outward ID is required' }),
    }),
})

// Get daily outward by ID schema
export const getDailyOutwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily outward ID is required' }),
    }),
})

// Delete daily outward schema
export const deleteDailyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily outward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailyOutwardSchema = z.object({
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
export const listDailyOutwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z
            .enum(['pending', 'completed', 'dispatched', 'cancelled'])
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
            .enum(['date', 'partyName', 'gatePassNumber', 'createdAt'])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryDailyOutwardSchema = z.object({
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
