/**
 * Broker Validators
 * =================
 * Zod validation schemas for broker operations
 */
import { z } from 'zod'
import { PAYMENT_MODE } from '../../../shared/constants/payment-types.js'

const paymentModes = Object.values(PAYMENT_MODE)

/**
 * Create broker schema
 */
export const createBrokerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters'),
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number')
            .optional(),
        email: z.string().email('Invalid email address').optional(),
        address: z
            .string()
            .max(500, 'Address cannot exceed 500 characters')
            .optional(),
        commissionRate: z
            .number()
            .min(0, 'Commission rate cannot be negative')
            .max(100, 'Commission rate cannot exceed 100%')
            .optional(),
        openingBalance: z.number().optional().default(0),
    }),
})

/**
 * Update broker schema
 */
export const updateBrokerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters')
            .optional(),
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number')
            .optional(),
        email: z.string().email('Invalid email address').optional().nullable(),
        address: z
            .string()
            .max(500, 'Address cannot exceed 500 characters')
            .optional()
            .nullable(),
        commissionRate: z.number().min(0).max(100).optional(),
        isActive: z.boolean().optional(),
    }),
})

/**
 * Broker ID param schema
 */
export const brokerIdParamSchema = z.object({
    params: z.object({
        brokerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid broker ID'),
    }),
})

/**
 * List brokers query schema
 */
export const listBrokersQuerySchema = z.object({
    query: z
        .object({
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional(),
            search: z.string().optional(),
            isActive: z
                .enum(['true', 'false'])
                .transform((v) => v === 'true')
                .optional(),
            sortBy: z
                .enum([
                    'name',
                    'commissionRate',
                    'currentBalance',
                    'createdAt',
                    'updatedAt',
                ])
                .optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        })
        .optional(),
})

/**
 * Record payment schema
 */
export const recordPaymentSchema = z.object({
    body: z.object({
        amount: z.number().positive('Payment amount must be positive'),
        paymentMode: z.enum(paymentModes, {
            errorMap: () => ({
                message: `Payment mode must be one of: ${paymentModes.join(', ')}`,
            }),
        }),
        reference: z
            .string()
            .max(100, 'Reference cannot exceed 100 characters')
            .optional(),
        date: z.string().datetime({ offset: true }).optional(),
    }),
    params: z.object({
        brokerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid broker ID'),
    }),
})
