import { z } from 'zod'

export const ricePurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    deliveryType: z.string().nullable().optional(),
    lotOrOther: z.string().nullable().optional(), // LOT / Other
    fciOrNAN: z.string().nullable().optional(), // FCI/NAN
    riceType: z.string().nullable().optional(),
    riceQty: z.number().optional(),
    riceRate: z.number().optional(),
    discountPercent: z.number().optional(),
    brokeragePerQuintal: z.number().optional(),
    gunnyType: z.string().nullable().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
    frkType: z.string().nullable().optional(),
    frkRatePerQuintal: z.number().optional(),
    lotNumber: z.string().nullable().optional(),
})

export type BalanceLiftingPurchasesRice = z.infer<typeof ricePurchaseSchema>
