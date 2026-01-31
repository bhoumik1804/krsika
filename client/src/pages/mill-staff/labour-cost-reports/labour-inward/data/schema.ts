import { z } from 'zod'

// Schema for LabourInward records
export const labourInwardSchema = z.object({
    date: z.string(),
    inwardType: z.string().optional(),
    truckNumber: z.string().optional(),
    totalGunny: z.number().optional(),
    numberOfGunnyBundle: z.number().optional(),
    unloadingRate: z.number().optional(),
    stackingRate: z.number().optional(),
    labourGroupName: z.string().optional(),
})

export type LabourInward = z.infer<typeof labourInwardSchema>
