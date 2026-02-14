import { z } from 'zod'

// Schema for Paddy Purchase records
export const paddyPurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    deliveryType: z.string().nullable().optional(),
    purchaseType: z.string().nullable().optional(),
    doNumber: z.string().nullable().optional(),
    committeeName: z.string().nullable().optional(),
    doPaddyQty: z.number().optional(),
    paddyType: z.string().nullable().optional(),
    totalPaddyQty: z.number().optional(),
    paddyRatePerQuintal: z.number().optional(),
    discountPercent: z.number().optional(),
    brokerage: z.number().optional(),
    gunnyType: z.string().nullable().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type BalanceLiftingPurchasesPaddy = z.infer<typeof paddyPurchaseSchema>
