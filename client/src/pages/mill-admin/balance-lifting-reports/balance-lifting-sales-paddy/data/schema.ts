import { z } from 'zod'

// Schema for linked outward data (Private Paddy Outward)
export const linkedPaddyOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    paddySaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    netWeight: z.number().optional(),
})

// Schema for Paddy Sales records
export const paddySalesSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    paddySalesDealNumber: z.string().optional(),
    partyName: z.string().min(1, 'Party Name is required'),
    brokerName: z.string().optional().nullable(),
    saleType: z.string().optional().nullable(),
    // DO specific fields (when saleType === 'DO बिक्री')
    doNumber: z.string().optional().nullable(),
    dhanMotaQty: z.coerce.number().default(0),
    dhanPatlaQty: z.coerce.number().default(0),
    dhanSarnaQty: z.coerce.number().default(0),
    // Paddy details
    dhanType: z.string().optional().nullable(),
    dhanQty: z.coerce.number().default(0),
    paddyRatePerQuintal: z.coerce.number().default(0),
    deliveryType: z.string().optional().nullable(),
    discountPercent: z.coerce.number().default(0),
    brokerage: z.coerce.number().default(0),
    // Gunny fields
    gunnyOption: z.string().optional().nullable(),
    newGunnyRate: z.coerce.number().default(0),
    oldGunnyRate: z.coerce.number().default(0),
    plasticGunnyRate: z.coerce.number().default(0),
    // Linked outward lifting data
    outwardData: z.array(linkedPaddyOutwardSchema).optional(),
})

export type PaddySales = z.infer<typeof paddySalesSchema>
