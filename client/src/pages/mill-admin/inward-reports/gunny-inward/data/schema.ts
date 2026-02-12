import { z } from 'zod'

export const gunnyInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    gunnyPurchaseDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    delivery: z.string().optional(),
    samitiSangrahan: z.string().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
})

export type GunnyInward = z.infer<typeof gunnyInwardSchema>
