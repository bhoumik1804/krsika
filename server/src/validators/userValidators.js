import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    role: z.enum(['mill-admin', 'mill-staff']),
    millId: z.string().min(1, 'Mill ID is required'),
    permissions: z.array(z.string()).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
    permissions: z.array(z.string()).optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

export const updatePermissionsSchema = z.object({
  body: z.object({
    permissions: z.array(z.string()),
  }),
});
