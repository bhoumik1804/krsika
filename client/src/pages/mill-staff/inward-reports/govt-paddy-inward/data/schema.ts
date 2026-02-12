import { z } from 'zod'

// Schema for GovtPaddyInward records
export const govtPaddyInwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    doNumber: z.string().min(1, 'DO Number is required'),
    committeeName: z.string().min(1, 'Committee Name is required'),
    balanceDo: z.number().optional(),
    gunnyNew: z.number().optional(),
    gunnyOld: z.number().optional(),
    gunnyPlastic: z.number().optional(),
    juteWeight: z.number().optional(),
    plasticWeight: z.number().optional(),
    gunnyWeight: z.number().optional(),
    truckNumber: z.string().min(1, 'Truck Number is required'),
    rstNumber: z.string().optional(),
    truckLoadWeight: z.number().optional(),
    paddyType: z.string().optional(),
    paddyMota: z.number().optional(),
    paddyPatla: z.number().optional(),
    paddySarna: z.number().optional(),
    paddyMahamaya: z.number().optional(),
    paddyRbGold: z.number().optional(),
})

export type GovtPaddyInward = z.infer<typeof govtPaddyInwardSchema>
