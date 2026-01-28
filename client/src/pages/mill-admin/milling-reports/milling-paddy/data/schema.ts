import { z } from 'zod'

// Schema for MillingPaddy records
export const millingPaddySchema = z.object({
    date: z.string(),
    paddyType: z.string(),
    hopperInGunny: z.number().optional(),
    hopperInQintal: z.number().optional(),
    riceType: z.string().optional(),
    riceQuantity: z.number().optional(),
    ricePercentage: z.number().optional(),
    khandaQuantity: z.number().optional(),
    khandaPercentage: z.number().optional(),
    kodhaQuantity: z.number().optional(),
    kodhaPercentage: z.number().optional(),
    bhusaTon: z.number().optional(),
    bhusaPercentage: z.number().optional(),
    nakkhiQuantity: z.number().optional(),
    nakkhiPercentage: z.number().optional(),
    wastagePercentage: z.number().optional(),
})

export type MillingPaddy = z.infer<typeof millingPaddySchema>
