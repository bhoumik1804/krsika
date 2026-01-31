import { z } from 'zod'

// Schema for Daily Sales Deals
export const salesDealSchema = z.object({
    id: z.string(),
    date: z.string(),
    buyerName: z.string(),
    brokerName: z.string().optional(),
    commodity: z.string(),
    quantity: z.number(),
    rate: z.number(),
    totalAmount: z.number(),
    status: z.enum(['pending', 'completed', 'cancelled']),
    paymentTerms: z.string().optional(),
    remarks: z.string().optional(),
})

export type SalesDeal = z.infer<typeof salesDealSchema>
