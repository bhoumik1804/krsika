import { z } from 'zod'

// Schema for Nakkhi Sales records
export const nakkhiSalesSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    nakkhiQty: z.number().optional(),
    nakkhiRate: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
    nakkhiSalesDealNumber: z.string().optional(),
})

export type NakkhiSales = z.infer<typeof nakkhiSalesSchema>
