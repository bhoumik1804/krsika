import { z } from 'zod'

// Schema for GunnyOutward records
export const GovtGunnyOutwardSchema = z.object({
    date: z.string(),
    gunnyDm: z.string(),
    samitiSangrahan: z.string(),
    oldGunnyQty: z.number(),
    plasticGunnyQty: z.number(),
    truckNo: z.string(),
})

export type GovtGunnyOutward = z.infer<typeof GovtGunnyOutwardSchema>
