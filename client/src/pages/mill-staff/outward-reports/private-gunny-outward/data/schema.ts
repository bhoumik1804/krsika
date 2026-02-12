import { z } from 'zod'

// Schema for private gunny outward records
export const PrivateGunnyOutwardSchema = z.object({
    _id: z.string(),
    date: z.string(),
    gunnyPurchaseDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    newGunnyQty: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    truckNo: z.string().optional(),
})

export type PrivateGunnyOutward = z.infer<typeof PrivateGunnyOutwardSchema>
