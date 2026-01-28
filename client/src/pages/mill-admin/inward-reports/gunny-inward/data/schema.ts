import { z } from 'zod'

export const gunnyInwardSchema = z.object({
    date: z.string(),
    purchaseDealId: z.string().optional(),
    partyName: z.string().optional(),
    delivery: z.string().optional(),
    samitiSangrahan: z.string().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
})

export type GunnyInward = z.infer<typeof gunnyInwardSchema>
