import { z } from 'zod'

// Schema for FRK Purchase records
export const frkPurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    frkQty: z.number().optional(),
    frkRate: z.number().optional(),
    gst: z.number().optional(),
})

export type BalanceLiftingPurchasesFrk = z.infer<typeof frkPurchaseSchema>
