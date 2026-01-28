import { z } from 'zod'

const millStatusSchema = z.union([
    z.literal('active'),
    z.literal('inactive'),
    z.literal('maintenance'),
    z.literal('closed'),
])
export type MillStatus = z.infer<typeof millStatusSchema>

const millTypeSchema = z.union([
    z.literal('rice'),
    z.literal('flour'),
    z.literal('oil'),
    z.literal('combined'),
])

const millSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    capacity: z.string(),
    type: millTypeSchema,
    status: millStatusSchema,
    manager: z.string(),
    phoneNumber: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type Mill = z.infer<typeof millSchema>

export const millListSchema = z.array(millSchema)
