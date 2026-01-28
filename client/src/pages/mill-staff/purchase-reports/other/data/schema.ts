import { z } from 'zod'

// Schema for Other Purchase records
export const otherPurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    otherPurchaseName: z.string().optional(),
    otherPurchaseQty: z.number().optional(),
    qtyType: z.string().optional(),
    rate: z.number().optional(),
    discountPercent: z.number().optional(),
    gst: z.number().optional(),
})

export type OtherPurchase = z.infer<typeof otherPurchaseSchema>
