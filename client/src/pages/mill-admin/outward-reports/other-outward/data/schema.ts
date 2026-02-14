import { z } from 'zod'

// Schema for OtherOutward records
export const otherOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    otherSaleDealNumber: z.string().nullable().optional(),
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
    truckNo: z.string().nullable().optional(),
    truckRst: z.string().nullable().optional(),
    truckWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    netWeight: z.number().optional(),
})

export type OtherOutward = z.infer<typeof otherOutwardSchema>
