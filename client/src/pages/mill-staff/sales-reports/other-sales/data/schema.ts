import { z } from 'zod'

// Schema for Other Sales records
export const otherSalesSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    otherSalesDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    otherSaleName: z.string().optional(),
    otherSaleQty: z.number().optional(),
    qtyType: z.string().optional(),
    rate: z.number().optional(),
    discountPercent: z.number().optional(),
    gst: z.number().optional(),
})

export type OtherSales = z.infer<typeof otherSalesSchema>
