import { z } from 'zod'

export const ricePurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    deliveryType: z.string().optional(),
    lotOrOther: z.string().optional(), // LOT / Other
    fciOrNAN: z.string().optional(), // FCI/NAN
    riceType: z.string().optional(),
    riceQty: z.number().optional(),
    riceRate: z.number().optional(),
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

export type RicePurchase = z.infer<typeof ricePurchaseSchema>
