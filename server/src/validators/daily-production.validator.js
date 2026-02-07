import { z } from 'zod'

/**
 * Daily Production Validators
 * Zod schemas for request validation
 */

// Common fields schema
const dailyProductionBaseSchema = {
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
    itemName: z
        .string({ required_error: 'Item name is required' })
        .trim()
        .min(1, 'Item name cannot be empty')
        .max(200, 'Item name is too long'),
    itemType: z
        .string({ required_error: 'Item type is required' })
        .trim()
        .min(1, 'Item type cannot be empty')
        .max(100, 'Item type is too long'),
    bags: z
        .number({ required_error: 'Bags count is required' })
        .int('Bags must be a whole number')
        .min(0, 'Bags cannot be negative'),
    weight: z
        .number({ required_error: 'Weight is required' })
        .min(0, 'Weight cannot be negative'),
    warehouse: z
        .string({ required_error: 'Warehouse is required' })
        .trim()
        .min(1, 'Warehouse cannot be empty')
        .max(200, 'Warehouse name is too long'),
    stackNumber: z
        .string()
        .trim()
        .max(50, 'Stack number is too long')
        .optional(),
    status: z.enum(['pending', 'verified', 'stocked', 'rejected'], {
        errorMap: () => ({
            message: 'Status must be pending, verified, stocked, or rejected',
        }),
    }),
    remarks: z.string().trim().max(500, 'Remarks is too long').optional(),
}

// Create daily production schema
export const createDailyProductionSchema = z.object({
    body: z.object({
        ...dailyProductionBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update daily production schema (all fields optional except id)
export const updateDailyProductionSchema = z.object({
    body: z.object({
        date: dailyProductionBaseSchema.date.optional(),
        itemName: dailyProductionBaseSchema.itemName.optional(),
        itemType: dailyProductionBaseSchema.itemType.optional(),
        bags: dailyProductionBaseSchema.bags.optional(),
        weight: dailyProductionBaseSchema.weight.optional(),
        warehouse: dailyProductionBaseSchema.warehouse.optional(),
        stackNumber: dailyProductionBaseSchema.stackNumber,
        status: dailyProductionBaseSchema.status.optional(),
        remarks: dailyProductionBaseSchema.remarks,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily production ID is required' }),
    }),
})

// Get daily production by ID schema
export const getDailyProductionByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily production ID is required' }),
    }),
})

// Delete daily production schema
export const deleteDailyProductionSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Daily production ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteDailyProductionSchema = z.object({
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
export const listDailyProductionSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        status: z
            .enum(['pending', 'verified', 'stocked', 'rejected'])
            .optional(),
        itemType: z.string().trim().optional(),
        warehouse: z.string().trim().optional(),
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
                'itemName',
                'itemType',
                'bags',
                'weight',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryDailyProductionSchema = z.object({
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
