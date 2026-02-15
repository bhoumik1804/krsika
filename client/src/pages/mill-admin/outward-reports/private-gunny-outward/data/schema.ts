import { z } from 'zod'

// Schema for private gunny outward records
export const PrivateGunnyOutwardSchema = z.object({
    _id: z.string(),
    date: z.string(),
    gunnySaleDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    newGunnyQty: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    truckNo: z.string().nullable().optional(),
})

export type PrivateGunnyOutward = z.infer<typeof PrivateGunnyOutwardSchema>
