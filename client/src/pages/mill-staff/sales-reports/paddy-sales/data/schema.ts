import { z } from 'zod'

// Schema for Paddy Sales records
export const paddySalesSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    saleType: z.string().optional(), // DO बिक्री / अन्य (मिल से बिक्री)
    // DO specific fields (when saleType === 'DO बिक्री')
    doNumber: z.string().optional(),
    dhanMotaQty: z.number().optional(),
    dhanPatlaQty: z.number().optional(),
    dhanSarnaQty: z.number().optional(),
    // Paddy details
    dhanType: z.string().optional(),
    dhanQty: z.number().optional(),
    paddyRatePerQuintal: z.number().optional(),
    deliveryType: z.string().optional(),
    discountPercent: z.number().optional(),
    brokerage: z.number().optional(),
    // Gunny fields
    gunnyType: z.string().optional(),
    //gunnyType == सहित (भाव में) then show below rates
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type PaddySales = z.infer<typeof paddySalesSchema>
