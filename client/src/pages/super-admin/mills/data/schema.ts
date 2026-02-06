import { z } from 'zod'
import { MILL_STATUS } from '@/constants'

// 1. Define the type for the values first (if you haven't already)
export type MillStatus = (typeof MILL_STATUS)[keyof typeof MILL_STATUS]

// 1. Extract values into a format Zod accepts (tuple of strings)
export const STATUS_VALUES = Object.values(MILL_STATUS) as [string, ...string[]]

// Mill info schema
const millInfoSchema = z.object({
    gstNumber: z.string(),
    panNumber: z.string(),
    mnmNumber: z.string(),
})

// Mill contact schema
const millContactSchema = z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
})

// Full mill schema from API response
const millResponseSchema = z.object({
    _id: z.string(),
    millName: z.string(),
    millInfo: millInfoSchema,
    contact: millContactSchema,
    status: z.string(),
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
    mnmNumber: z.string(),
    status: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type Mill = z.infer<typeof millSchema>

export const millListSchema = z.array(millSchema)
