import { z } from 'zod'

// Schema for Paddy Purchase records
export const paddyPurchaseSchema = z.object({
    _id: z.string().optional(),
    paddyPurchaseDealNumber: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    brokerName: z.string().optional(),
    deliveryType: z.string().optional(),
    purchaseType: z.string().optional(),
    doNumber: z.string().optional(),
    committeeName: z.string().optional(),
    doPaddyQty: z.number().optional(),
    paddyType: z.string().optional(),
    totalPaddyQty: z.number().optional(),
    paddyRatePerQuintal: z.number().optional(),
    discountPercent: z.number().optional(),
    brokerage: z.number().optional(),
    gunnyType: z.string().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
    balance: z.number().optional(),
    balanceLifting: z.number().optional(),
    inwardData: z.array(z.any()).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type BalanceLiftingPurchasesPaddy = z.infer<typeof paddyPurchaseSchema>
