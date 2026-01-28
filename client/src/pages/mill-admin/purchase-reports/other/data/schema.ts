import { z } from 'zod'

// Schema for Other Purchase records
export const otherPurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    anyaName: z.string().optional(),
    anyaQty: z.number().optional(),
    qtyType: z.string().optional(),
    anyaRate: z.number().optional(),
    discountPercent: z.number().optional(),
    gst: z.number().optional(),
})

export type OtherPurchase = z.infer<typeof otherPurchaseSchema>
