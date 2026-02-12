import { z } from 'zod'

export const riceSalesSchema = z.object({
    _id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    deliveryType: z.string().optional(),
    lotOrOther: z.string().optional(),
    fciOrNAN: z.string().optional(), // FCI/NAN
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
})

export type RiceSales = z.infer<typeof riceSalesSchema>
