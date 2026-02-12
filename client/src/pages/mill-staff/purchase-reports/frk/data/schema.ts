import { z } from 'zod'

// Schema for FRK Purchase records
export const frkPurchaseSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().min(1, 'Party name is required'),
    frkQty: z.number().optional(),
    frkRate: z.number().optional(),
    gst: z.number().optional(),
})

export type FrkPurchaseData = z.infer<typeof frkPurchaseSchema>
