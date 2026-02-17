import { z } from 'zod'

export const gunnyInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    gunnyPurchaseDealId: z.string().optional(),
    gunnyPurchaseDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    delivery: z.string().nullable().optional(),
    samitiSangrahan: z.string().nullable().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
})

export type GunnyInward = z.infer<typeof gunnyInwardSchema>
export type GunnyInwardSchema = GunnyInward
