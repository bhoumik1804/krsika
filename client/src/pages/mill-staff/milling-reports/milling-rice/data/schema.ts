import { z } from 'zod'

// Schema for MillingRice records
export const millingRiceSchema = z.object({
    _id: z.string().optional(),
    date: z.string(),
    riceType: z.string().optional(),
    hopperInGunny: z.number().optional(),
    hopperInQintal: z.number().optional(),
    riceQuantity: z.number().optional(),
    ricePercentage: z.number().optional(),
    khandaQuantity: z.number().optional(),
    khandaPercentage: z.number().optional(),
    silkyKodhaQuantity: z.number().optional(),
    silkyKodhaPercentage: z.number().optional(),
    wastagePercentage: z.number().optional(),
})

export type MillingRice = z.infer<typeof millingRiceSchema>
