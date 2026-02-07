import { z } from 'zod'

// Schema for FRK Purchase records
export const frkPurchaseSchema = z.object({
    id: z.string(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().min(1, 'Party name is required'),
    totalWeight: z.number().optional(),
    rate: z.number().optional(),
    amount: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type FrkPurchaseData = z.infer<typeof frkPurchaseSchema>
