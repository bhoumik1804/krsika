import { z } from 'zod'

// Schema for Gunny Purchase records
export const gunnyPurchaseSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().nullable().optional(),
    deliveryType: z.string().nullable().optional(),
    newGunnyQty: z.number().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type BalanceLiftingPurchasesGunny = z.infer<typeof gunnyPurchaseSchema>
