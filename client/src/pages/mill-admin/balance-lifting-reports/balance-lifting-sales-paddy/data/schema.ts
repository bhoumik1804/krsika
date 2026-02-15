import { z } from 'zod'

// Schema for Paddy Sales records
export const balanceLiftingSalesPaddySchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    saleType: z.string().nullable().optional(), // DO बिक्री / अन्य (मिल से बिक्री)
    // DO specific fields (when saleType === 'DO बिक्री')
    doNumber: z.string().nullable().optional(),
    dhanMotaQty: z.number().optional(),
    dhanPatlaQty: z.number().optional(),
    dhanSarnaQty: z.number().optional(),
    // Paddy details
    dhanType: z.string().nullable().optional(),
    dhanQty: z.number().optional(),
    paddyRatePerQuintal: z.number().optional(),
    deliveryType: z.string().nullable().optional(),
    discountPercent: z.number().optional(),
    brokerage: z.number().optional(),
    // Gunny fields
    gunnyType: z.string().nullable().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type BalanceLiftingSalesPaddy = z.infer<
    typeof balanceLiftingSalesPaddySchema
>
