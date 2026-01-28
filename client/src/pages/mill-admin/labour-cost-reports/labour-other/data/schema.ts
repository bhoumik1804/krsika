import { z } from 'zod'

export const labourOtherSchema = z.object({
    date: z.string(),
    labourType: z.string().optional(),
    labourGroupName: z.string().optional(),
    numberOfGunny: z.number().optional(),
    labourRate: z.number().optional(),
    workDetail: z.string().optional(),
    totalPrice: z.number().optional(),
})

export type LabourOther = z.infer<typeof labourOtherSchema>
