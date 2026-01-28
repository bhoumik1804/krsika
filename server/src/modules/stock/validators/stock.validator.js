/**
 * Stock Validators
 * ================
 * Zod validation schemas for stock operations
 */
import { z } from 'zod'
import { STOCK_TYPE } from '../../../shared/constants/stock-types.js'

const stockTypes = Object.values(STOCK_TYPE)

/**
 * Initialize stock schema
 */
export const initializeStockSchema = z.object({
    body: z.object({
        stockType: z.enum(stockTypes, {
            errorMap: () => ({
                message: `Stock type must be one of: ${stockTypes.join(', ')}`,
            }),
        }),
        lowStockThreshold: z
            .number()
            .min(0, 'Threshold must be non-negative')
            .optional()
            .default(100),
    }),
})

/**
 * Update stock threshold schema
 */
export const updateThresholdSchema = z.object({
    body: z.object({
        lowStockThreshold: z.number().min(0, 'Threshold must be non-negative'),
    }),
    params: z.object({
        stockId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid stock ID'),
    }),
})

/**
 * Stock ID param schema
 */
export const stockIdParamSchema = z.object({
    params: z.object({
        stockId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid stock ID'),
    }),
})

/**
 * List stocks query schema
 */
export const listStocksQuerySchema = z.object({
    query: z
        .object({
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional(),
            stockType: z.enum(stockTypes).optional(),
            sortBy: z
                .enum([
                    'stockType',
                    'currentQuantity',
                    'createdAt',
                    'updatedAt',
                ])
                .optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
            lowStock: z
                .enum(['true', 'false'])
                .transform((v) => v === 'true')
                .optional(),
        })
        .optional(),
})

/**
 * Stock transfer schema
 */
export const stockTransferSchema = z.object({
    body: z
        .object({
            fromStockType: z.enum(stockTypes, {
                errorMap: () => ({
                    message: `From stock type must be one of: ${stockTypes.join(', ')}`,
                }),
            }),
            toStockType: z.enum(stockTypes, {
                errorMap: () => ({
                    message: `To stock type must be one of: ${stockTypes.join(', ')}`,
                }),
            }),
            fromQuantity: z.number().positive('From quantity must be positive'),
            toQuantity: z.number().positive('To quantity must be positive'),
            note: z
                .string()
                .max(500, 'Note cannot exceed 500 characters')
                .optional(),
        })
        .refine((data) => data.fromStockType !== data.toStockType, {
            message: 'From and To stock types must be different',
            path: ['toStockType'],
        }),
})

/**
 * Stock adjustment schema
 */
export const stockAdjustmentSchema = z.object({
    body: z.object({
        adjustmentQuantity: z
            .number({
                required_error: 'Adjustment quantity is required',
            })
            .refine((val) => val !== 0, {
                message: 'Adjustment quantity cannot be zero',
            }),
        reason: z
            .string()
            .min(5, 'Reason must be at least 5 characters')
            .max(500, 'Reason cannot exceed 500 characters'),
    }),
    params: z.object({
        stockId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid stock ID'),
    }),
})

/**
 * Check availability schema
 */
export const checkAvailabilitySchema = z.object({
    query: z.object({
        stockType: z.enum(stockTypes, {
            errorMap: () => ({
                message: `Stock type must be one of: ${stockTypes.join(', ')}`,
            }),
        }),
        quantity: z
            .string()
            .regex(/^\d+(\.\d+)?$/)
            .transform(Number),
    }),
})
