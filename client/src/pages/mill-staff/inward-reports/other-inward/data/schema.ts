import { z } from 'zod'

export const otherInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    otherPurchaseDealNumber: z.string().nullable().optional(),
    itemName: z.string().nullable().optional(),
    quantity: z.number().optional(),
    quantityType: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteGunnyWeight: z.number().optional(),
    plasticGunnyWeight: z.number().optional(),
    truckNumber: z.string().nullable().optional(),
    rstNumber: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type OtherInward = z.infer<typeof otherInwardSchema>
