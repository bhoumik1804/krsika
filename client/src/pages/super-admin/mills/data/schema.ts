import { z } from 'zod'

// API response status schema (matches server enum)
const millStatusSchema = z.union([
    z.literal('PENDING_VERIFICATION'),
    z.literal('ACTIVE'),
    z.literal('SUSPENDED'),
    z.literal('REJECTED'),
])
export type MillStatus = z.infer<typeof millStatusSchema>

// Mill info schema
const millInfoSchema = z.object({
    gstNumber: z.string(),
    panNumber: z.string(),
})

// Mill contact schema
const millContactSchema = z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string().optional(),
})

// Mill settings schema
const millSettingsSchema = z.object({
    currency: z.string(),
    taxPercentage: z.number(),
})

// Plan reference schema
const planReferenceSchema = z
    .object({
        _id: z.string(),
        name: z.string(),
        price: z.number(),
        billingCycle: z.string(),
    })
    .nullable()

// Full mill schema from API response
const millResponseSchema = z.object({
    _id: z.string(),
    millName: z.string(),
    millInfo: millInfoSchema,
    contact: millContactSchema,
    status: millStatusSchema,
    currentPlan: planReferenceSchema,
    planValidUntil: z.string().nullable(),
    settings: millSettingsSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
})
export type MillResponse = z.infer<typeof millResponseSchema>

// Transformed mill for table display
const millSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    gstNumber: z.string(),
    panNumber: z.string(),
    currency: z.string(),
    taxPercentage: z.number(),
    status: millStatusSchema,
    planName: z.string().nullable(),
    planValidUntil: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type Mill = z.infer<typeof millSchema>

export const millListSchema = z.array(millSchema)
