import { z } from 'zod'

/**
 * Private Paddy Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const privatePaddyInwardBaseSchema = {
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
    paddyPurchaseDealNumber: z
        .string()
        .trim()
        .max(100, 'Paddy purchase deal number is too long')
        .optional(),
    partyName: z.string().trim().max(200, 'Party name is too long').optional(),
    brokerName: z
        .string()
        .trim()
        .max(200, 'Broker name is too long')
        .optional(),
    balanceDo: z.number().min(0, 'Balance DO cannot be negative').optional(),
    purchaseType: z
        .string()
        .trim()
        .max(100, 'Purchase type is too long')
        .optional(),
    doNumber: z.string().trim().max(100, 'DO number is too long').optional(),
    committeeName: z
        .string()
        .trim()
        .max(200, 'Committee name is too long')
        .optional(),
    gunnyOption: z
        .string()
        .trim()
        .max(100, 'Gunny option is too long')
        .optional(),
    gunnyNew: z.number().min(0, 'Gunny new cannot be negative').optional(),
    gunnyOld: z.number().min(0, 'Gunny old cannot be negative').optional(),
    gunnyPlastic: z
        .number()
        .min(0, 'Gunny plastic cannot be negative')
        .optional(),
    juteWeight: z.number().min(0, 'Jute weight cannot be negative').optional(),
    plasticWeight: z
        .number()
        .min(0, 'Plastic weight cannot be negative')
        .optional(),
    gunnyWeight: z
        .number()
        .min(0, 'Gunny weight cannot be negative')
        .optional(),
    truckNumber: z
        .string()
        .trim()
        .max(20, 'Truck number is too long')
        .optional(),
    rstNumber: z.string().trim().max(100, 'RST number is too long').optional(),
    truckLoadWeight: z
        .number()
        .min(0, 'Truck load weight cannot be negative')
        .optional(),
    paddyType: z.string().trim().max(100, 'Paddy type is too long').optional(),
    paddyMota: z.number().min(0, 'Paddy mota cannot be negative').optional(),
    paddyPatla: z.number().min(0, 'Paddy patla cannot be negative').optional(),
    paddySarna: z.number().min(0, 'Paddy sarna cannot be negative').optional(),
    paddyMahamaya: z
        .number()
        .min(0, 'Paddy mahamaya cannot be negative')
        .optional(),
    paddyRbGold: z
        .number()
        .min(0, 'Paddy RB Gold cannot be negative')
        .optional(),
}

// Create private paddy inward schema
export const createPrivatePaddyInwardSchema = z.object({
    body: z.object({
        ...privatePaddyInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update private paddy inward schema (all fields optional except id)
export const updatePrivatePaddyInwardSchema = z.object({
    body: z.object({
        date: privatePaddyInwardBaseSchema.date.optional(),
        paddyPurchaseDealNumber:
            privatePaddyInwardBaseSchema.paddyPurchaseDealNumber,
        partyName: privatePaddyInwardBaseSchema.partyName,
        brokerName: privatePaddyInwardBaseSchema.brokerName,
        balanceDo: privatePaddyInwardBaseSchema.balanceDo,
        purchaseType: privatePaddyInwardBaseSchema.purchaseType,
        doNumber: privatePaddyInwardBaseSchema.doNumber,
        committeeName: privatePaddyInwardBaseSchema.committeeName,
        gunnyOption: privatePaddyInwardBaseSchema.gunnyOption,
        gunnyNew: privatePaddyInwardBaseSchema.gunnyNew,
        gunnyOld: privatePaddyInwardBaseSchema.gunnyOld,
        gunnyPlastic: privatePaddyInwardBaseSchema.gunnyPlastic,
        juteWeight: privatePaddyInwardBaseSchema.juteWeight,
        plasticWeight: privatePaddyInwardBaseSchema.plasticWeight,
        gunnyWeight: privatePaddyInwardBaseSchema.gunnyWeight,
        truckNumber: privatePaddyInwardBaseSchema.truckNumber,
        rstNumber: privatePaddyInwardBaseSchema.rstNumber,
        truckLoadWeight: privatePaddyInwardBaseSchema.truckLoadWeight,
        paddyType: privatePaddyInwardBaseSchema.paddyType,
        paddyMota: privatePaddyInwardBaseSchema.paddyMota,
        paddyPatla: privatePaddyInwardBaseSchema.paddyPatla,
        paddySarna: privatePaddyInwardBaseSchema.paddySarna,
        paddyMahamaya: privatePaddyInwardBaseSchema.paddyMahamaya,
        paddyRbGold: privatePaddyInwardBaseSchema.paddyRbGold,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Private paddy inward ID is required' }),
    }),
})

// Get private paddy inward by ID schema
export const getPrivatePaddyInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Private paddy inward ID is required' }),
    }),
})

// Delete private paddy inward schema
export const deletePrivatePaddyInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Private paddy inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeletePrivatePaddyInwardSchema = z.object({
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
export const listPrivatePaddyInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        purchaseType: z.string().trim().optional(),
        paddyType: z.string().trim().optional(),
        partyName: z.string().trim().optional(),
        brokerName: z.string().trim().optional(),
        committeeName: z.string().trim().optional(),
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
                'partyName',
                'brokerName',
                'truckNumber',
                'paddyType',
                'truckLoadWeight',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryPrivatePaddyInwardSchema = z.object({
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
