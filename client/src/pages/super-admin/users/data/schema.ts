import { z } from 'zod'

// API response status (derived from isActive)
const userStatusSchema = z.union([
    z.literal('active'),
    z.literal('inactive'),
    z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

// User role schema (matches server enum)
const userRoleSchema = z.union([
    z.literal('super-admin'),
    z.literal('mill-admin'),
    z.literal('mill-staff'),
    z.literal('guest-user'),
])
export type UserRole = z.infer<typeof userRoleSchema>

// Mill reference schema
const millReferenceSchema = z
    .object({
        _id: z.string(),
        millName: z.string(),
        status: z.string(),
    })
    .nullable()

// Permission schema
const permissionSchema = z.object({
    moduleSlug: z.string(),
    actions: z.array(z.string()),
})

// Full user schema from API response
const userResponseSchema = z.object({
    _id: z.string(),
    millId: millReferenceSchema,
    fullName: z.string(),
    email: z.string(),
    googleId: z.string().nullable(),
    avatar: z.string().nullable(),
    role: userRoleSchema,
    permissions: z.array(permissionSchema),
    isActive: z.boolean(),
    lastLogin: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})
export type UserResponse = z.infer<typeof userResponseSchema>

// Transformed user for table display - matches User model
const userSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    status: userStatusSchema,
    role: userRoleSchema,
    millId: millReferenceSchema,
    lastLogin: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
