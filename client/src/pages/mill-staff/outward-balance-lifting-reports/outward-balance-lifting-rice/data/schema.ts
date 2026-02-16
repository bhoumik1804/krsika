import { z } from 'zod'

// Schema for linked outward data (Private Rice Outward)
export const linkedOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    riceSaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    netWeight: z.number().optional(),
})

// Schema for Rice Sales (Lifting Report)
export const PrivateRiceOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    riceSalesDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    deliveryType: z.string().optional(),
    lotOrOther: z.string().optional(),
    fciOrNAN: z.string().optional(),
    riceType: z.string().optional(),
    riceQty: z.number().optional(),
    riceRatePerQuintal: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
    gunnyType: z.string().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
    frkType: z.string().optional(),
    frkRatePerQuintal: z.number().optional(),
    lotNumber: z.string().optional(),
    // Linked outward lifting data
    outwardData: z.array(linkedOutwardSchema).optional(),
})

export type PrivateRiceOutward = z.infer<typeof PrivateRiceOutwardSchema>
