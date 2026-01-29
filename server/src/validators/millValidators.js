import { z } from 'zod';

export const createMillSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Mill name must be at least 2 characters'),
    code: z.string().min(2, 'Mill code is required'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    subscriptionPlan: z.enum(['basic', 'professional', 'enterprise']).optional(),
    subscriptionExpiresAt: z.string().datetime().optional(),
    ownerId: z.string().min(1, 'Owner ID is required'),
  }),
});

export const updateMillSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Mill name must be at least 2 characters').optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
    subscriptionPlan: z.enum(['basic', 'professional', 'enterprise']).optional(),
    subscriptionExpiresAt: z.string().datetime().optional(),
  }),
});

export const millIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Mill ID is required'),
  }),
});
