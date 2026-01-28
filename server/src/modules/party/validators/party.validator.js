/**
 * Party Validators
 * ================
 * Zod validation schemas for party operations
 */
import { z } from 'zod'

/**
 * Create party schema
 */
export const createPartySchema = z.object({
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
        city: z
            .string()
            .max(100, 'City cannot exceed 100 characters')
            .optional(),
        state: z
            .string()
            .max(100, 'State cannot exceed 100 characters')
            .optional(),
        pincode: z
            .string()
            .regex(/^\d{6}$/, 'Invalid pincode')
            .optional(),
        gstn: z
            .string()
            .regex(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                'Invalid GSTN number'
            )
            .optional(),
        bankName: z
            .string()
            .max(100, 'Bank name cannot exceed 100 characters')
            .optional(),
        accountNumber: z
            .string()
            .max(20, 'Account number cannot exceed 20 characters')
            .optional(),
        ifscCode: z
            .string()
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
            .optional(),
        openingBalance: z.number().optional().default(0),
    }),
})

/**
 * Update party schema
 */
export const updatePartySchema = z.object({
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
        city: z.string().max(100).optional().nullable(),
        state: z.string().max(100).optional().nullable(),
        pincode: z
            .string()
            .regex(/^\d{6}$/)
            .optional()
            .nullable(),
        gstn: z
            .string()
            .regex(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                'Invalid GSTN number'
            )
            .optional()
            .nullable(),
        bankName: z.string().max(100).optional().nullable(),
        accountNumber: z.string().max(20).optional().nullable(),
        ifscCode: z
            .string()
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/)
            .optional()
            .nullable(),
        isActive: z.boolean().optional(),
    }),
})

/**
 * Party ID param schema
 */
export const partyIdParamSchema = z.object({
    params: z.object({
        partyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid party ID'),
    }),
})

/**
 * List parties query schema
 */
export const listPartiesQuerySchema = z.object({
    query: z
        .object({
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional(),
            search: z.string().optional(),
            sortBy: z
                .enum([
                    'name',
                    'currentBalance',
                    'createdAt',
                    'updatedAt',
                    'city',
                ])
                .optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
            isActive: z
                .enum(['true', 'false'])
                .transform((v) => v === 'true')
                .optional(),
            hasBalance: z
                .enum(['true', 'false'])
                .transform((v) => v === 'true')
                .optional(),
        })
        .optional(),
})

/**
 * Ledger query schema
 */
export const ledgerQuerySchema = z.object({
    query: z
        .object({
            startDate: z.string().datetime({ offset: true }).optional(),
            endDate: z.string().datetime({ offset: true }).optional(),
            page: z.string().regex(/^\d+$/).transform(Number).optional(),
            limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        })
        .optional(),
    params: z.object({
        partyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid party ID'),
    }),
})

/**
 * Outstanding balances query schema
 */
export const outstandingQuerySchema = z.object({
    query: z
        .object({
            type: z.enum(['all', 'receivable', 'payable']).optional(),
            sortBy: z.enum(['name', 'currentBalance']).optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        })
        .optional(),
})
