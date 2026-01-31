import { z } from 'zod'

// Schema for Daily Production Entries
export const productionSchema = z.object({
    id: z.string(),
    date: z.string(),
    itemName: z.string(),
    itemType: z.string(),
    bags: z.number(),
    weight: z.number(),
    warehouse: z.string(),
    stackNumber: z.string().optional(),
    status: z.enum(['pending', 'verified', 'stocked', 'rejected']),
    remarks: z.string().optional(),
})

export type ProductionEntry = z.infer<typeof productionSchema>
