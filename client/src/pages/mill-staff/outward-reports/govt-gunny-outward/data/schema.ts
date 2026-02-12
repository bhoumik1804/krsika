import { z } from 'zod'

// Schema for GunnyOutward records
export const GovtGunnyOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    gunnyDmNumber: z.string().optional(),
    samitiSangrahan: z.string().optional(),
    oldGunnyQty: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    truckNo: z.string().optional(),
})

export type GovtGunnyOutward = z.infer<typeof GovtGunnyOutwardSchema>
