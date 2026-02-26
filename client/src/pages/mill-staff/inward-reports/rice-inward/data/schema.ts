import { z } from 'zod'

export const riceInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    ricePurchaseDealNumber: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    riceType: z.string().nullable().optional(),
    balanceInward: z.number().optional(),
    inwardType: z.string().nullable().optional(), // 'LOT खरीदी' | 'चावल खरीदी'
    lotNumber: z.string().nullable().optional(),
    frkOrNAN: z.string().nullable().optional(),
    gunnyOption: z.string().nullable().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    truckNumber: z.string().nullable().optional(),
    rstNumber: z.string().nullable().optional(),
    truckLoadWeight: z.number().optional(),
    riceMotaNetWeight: z.number().optional(),
    ricePatlaNetWeight: z.number().optional(),
})

export type RiceInward = z.infer<typeof riceInwardSchema>
