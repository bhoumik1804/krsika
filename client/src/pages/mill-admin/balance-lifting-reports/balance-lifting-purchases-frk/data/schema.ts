import { z } from 'zod'

// Schema for FRK Purchase records
export const frkPurchaseSchema = z.object({
    _id: z.string().optional(),
    frkPurchaseDealNumber: z.string().nullable().optional(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().nullable().optional(),
    frkQty: z.number().optional(),
    frkRate: z.number().optional(),
    gst: z.number().optional(),
    inwardData: z.array(z.any()).optional(),
})

export type BalanceLiftingPurchasesFrk = z.infer<typeof frkPurchaseSchema>
