import { z } from 'zod'

/**
 * Govt Paddy Inward Validators
 * Zod schemas for request validation
 */

// Common fields schema
const govtPaddyInwardBaseSchema = {
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
    doNumber: z
        .string({ required_error: 'DO number is required' })
        .trim()
        .min(1, 'DO number cannot be empty')
        .max(50, 'DO number is too long'),
    committeeName: z
        .string({ required_error: 'Committee name is required' })
        .trim()
        .min(1, 'Committee name cannot be empty')
        .max(200, 'Committee name is too long'),
    balanceDo: z.number().min(0, 'Balance DO cannot be negative').optional(),
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
        .string({ required_error: 'Truck number is required' })
        .trim()
        .min(1, 'Truck number cannot be empty')
        .max(20, 'Truck number is too long'),
    rstNumber: z.string().trim().max(50, 'RST number is too long').optional(),
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
        .min(0, 'Paddy RB gold cannot be negative')
        .optional(),
}

// Create govt paddy inward schema
export const createGovtPaddyInwardSchema = z.object({
    body: z.object({
        ...govtPaddyInwardBaseSchema,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
})

// Update govt paddy inward schema (all fields optional except id)
export const updateGovtPaddyInwardSchema = z.object({
    body: z.object({
        date: govtPaddyInwardBaseSchema.date.optional(),
        doNumber: govtPaddyInwardBaseSchema.doNumber.optional(),
        committeeName: govtPaddyInwardBaseSchema.committeeName.optional(),
        balanceDo: govtPaddyInwardBaseSchema.balanceDo,
        gunnyNew: govtPaddyInwardBaseSchema.gunnyNew,
        gunnyOld: govtPaddyInwardBaseSchema.gunnyOld,
        gunnyPlastic: govtPaddyInwardBaseSchema.gunnyPlastic,
        juteWeight: govtPaddyInwardBaseSchema.juteWeight,
        plasticWeight: govtPaddyInwardBaseSchema.plasticWeight,
        gunnyWeight: govtPaddyInwardBaseSchema.gunnyWeight,
        truckNumber: govtPaddyInwardBaseSchema.truckNumber.optional(),
        rstNumber: govtPaddyInwardBaseSchema.rstNumber,
        truckLoadWeight: govtPaddyInwardBaseSchema.truckLoadWeight,
        paddyType: govtPaddyInwardBaseSchema.paddyType,
        paddyMota: govtPaddyInwardBaseSchema.paddyMota,
        paddyPatla: govtPaddyInwardBaseSchema.paddyPatla,
        paddySarna: govtPaddyInwardBaseSchema.paddySarna,
        paddyMahamaya: govtPaddyInwardBaseSchema.paddyMahamaya,
        paddyRbGold: govtPaddyInwardBaseSchema.paddyRbGold,
    }),
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt paddy inward ID is required' }),
    }),
})

// Get govt paddy inward by ID schema
export const getGovtPaddyInwardByIdSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt paddy inward ID is required' }),
    }),
})

// Delete govt paddy inward schema
export const deleteGovtPaddyInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
        id: z.string({ required_error: 'Govt paddy inward ID is required' }),
    }),
})

// Bulk delete schema
export const bulkDeleteGovtPaddyInwardSchema = z.object({
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
export const listGovtPaddyInwardSchema = z.object({
    params: z.object({
        millId: z.string({ required_error: 'Mill ID is required' }),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
        search: z.string().trim().optional(),
        paddyType: z.string().trim().optional(),
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
                'doNumber',
                'committeeName',
                'truckNumber',
                'truckLoadWeight',
                'createdAt',
            ])
            .default('date')
            .optional(),
        sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    }),
})

// Summary query params schema
export const summaryGovtPaddyInwardSchema = z.object({
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
