/**
 * Sale Validators
 * ================
 * Zod schemas for sale validation
 */
import { z } from 'zod'

/**
 * Create sale schema
 */
export const createSaleSchema = z.object({
    body: z.object({
        invoiceNumber: z.string().optional(),
        saleDate: z.coerce.date(),
        partyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid party ID'),
        brokerId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid broker ID')
            .optional()
            .nullable(),
        transporterId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid transporter ID')
            .optional()
            .nullable(),
        stockType: z.enum(
            [
                'PADDY',
                'RICE',
                'GUNNY',
                'FRK',
                'KHANDA',
                'NAKKHI',
                'BHUSA',
                'KODHA',
                'OTHER',
            ],
            {
                errorMap: () => ({ message: 'Invalid stock type' }),
            }
        ),
        variety: z.string().min(1, 'Variety is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unit: z.enum(['QUINTAL', 'KG', 'BAG', 'PIECE']).default('QUINTAL'),
        pricePerUnit: z.number().min(0, 'Price must be non-negative'),
        totalAmount: z.number().min(0).optional(),
        gstRate: z.number().min(0).max(100).default(0),
        gstAmount: z.number().min(0).optional(),
        brokerCommission: z.number().min(0).default(0),
        hamali: z.number().min(0).default(0),
        cartage: z.number().min(0).default(0),
        otherCharges: z.number().min(0).default(0),
        receivedAmount: z.number().min(0).default(0),
        paymentMode: z
            .enum(['CASH', 'UPI', 'BANK', 'CREDIT', 'CHEQUE'])
            .default('CASH'),
        remarks: z.string().optional(),
    }),
})

/**
 * Update sale schema
 */
export const updateSaleSchema = z.object({
    body: z.object({
        invoiceNumber: z.string().optional(),
        saleDate: z.coerce.date().optional(),
        partyId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid party ID')
            .optional(),
        brokerId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid broker ID')
            .optional()
            .nullable(),
        transporterId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid transporter ID')
            .optional()
            .nullable(),
        stockType: z
            .enum([
                'PADDY',
                'RICE',
                'GUNNY',
                'FRK',
                'KHANDA',
                'NAKKHI',
                'BHUSA',
                'KODHA',
                'OTHER',
            ])
            .optional(),
        variety: z.string().min(1).optional(),
        quantity: z.number().positive().optional(),
        unit: z.enum(['QUINTAL', 'KG', 'BAG', 'PIECE']).optional(),
        pricePerUnit: z.number().min(0).optional(),
        totalAmount: z.number().min(0).optional(),
        gstRate: z.number().min(0).max(100).optional(),
        gstAmount: z.number().min(0).optional(),
        brokerCommission: z.number().min(0).optional(),
        hamali: z.number().min(0).optional(),
        cartage: z.number().min(0).optional(),
        otherCharges: z.number().min(0).optional(),
        receivedAmount: z.number().min(0).optional(),
        paymentMode: z
            .enum(['CASH', 'UPI', 'BANK', 'CREDIT', 'CHEQUE'])
            .optional(),
        remarks: z.string().optional(),
    }),
})

/**
 * Record payment schema
 */
export const recordPaymentSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be positive'),
        paymentMode: z.enum(['CASH', 'UPI', 'BANK', 'CHEQUE']),
        paymentDate: z.coerce.date().default(() => new Date()),
        chequeNumber: z.string().optional(),
        chequeDate: z.coerce.date().optional(),
        remarks: z.string().optional(),
    }),
})

/**
 * Sale ID param schema
 */
export const saleIdParamSchema = z.object({
    params: z.object({
        millId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mill ID'),
        saleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid sale ID'),
    }),
})

/**
 * Mill ID param schema
 */
export const millIdParamSchema = z.object({
    params: z.object({
        millId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mill ID'),
    }),
})

/**
 * Query params for listing sales
 */
export const listSalesQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1).optional(),
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(10)
            .optional(),
        sortBy: z
            .enum(['saleDate', 'invoiceNumber', 'totalAmount', 'createdAt'])
            .default('saleDate')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
        search: z.string().optional(),
        partyId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .optional(),
        stockType: z
            .enum([
                'PADDY',
                'RICE',
                'GUNNY',
                'FRK',
                'KHANDA',
                'NAKKHI',
                'BHUSA',
                'KODHA',
                'OTHER',
            ])
            .optional(),
        paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }),
})

/**
 * Summary query schema
 */
export const summaryQuerySchema = z.object({
    query: z.object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        stockType: z
            .enum([
                'PADDY',
                'RICE',
                'GUNNY',
                'FRK',
                'KHANDA',
                'NAKKHI',
                'BHUSA',
                'KODHA',
                'OTHER',
            ])
            .optional(),
    }),
})

export default {
    createSaleSchema,
    updateSaleSchema,
    recordPaymentSchema,
    saleIdParamSchema,
    millIdParamSchema,
    listSalesQuerySchema,
    summaryQuerySchema,
}
