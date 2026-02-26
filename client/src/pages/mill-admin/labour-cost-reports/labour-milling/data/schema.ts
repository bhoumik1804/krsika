import { z } from 'zod'

export const labourMillingSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    hopperInGunny: z.number().optional(),
    hopperRate: z.number().optional(),
    labourGroupName: z.string().optional(),
})

export type LabourMilling = z.infer<typeof labourMillingSchema>
