import { z } from 'zod'

// Schema for Paddy Sales records
export const paddySalesSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    paddySalesDealNumber: z.string().optional(),
    partyName: z.string(),
    brokerName: z.string(),
    saleType: z.string(), // DO बिक्री / अन्य (मिल से बिक्री)
    // DO specific fields (when saleType === 'DO बिक्री')
    doNumber: z.string(),
    dhanMotaQty: z.number(),
    dhanPatlaQty: z.number(),
    dhanSarnaQty: z.number(),
    // Paddy details
    dhanType: z.string(),
    dhanQty: z.number(),
    paddyRatePerQuintal: z.number(),
    deliveryType: z.string(),
    discountPercent: z.number(),
    brokerage: z.number(),
    // Gunny fields
    gunnyOption: z.string(),
    newGunnyRate: z.number(),
    oldGunnyRate: z.number(),
    plasticGunnyRate: z.number(),
})

export type PaddySales = z.infer<typeof paddySalesSchema>
