import { z } from 'zod'

// Schema for StockRice records
export const stockRiceSchema = z.object({
    id: z.string(),
    mota: z.number(),
    patla: z.number(),
})

export type StockRice = z.infer<typeof stockRiceSchema>
