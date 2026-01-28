import { z } from 'zod'

// Schema for StockByProducts records
export const stockByProductsSchema = z.object({
    id: z.string(),
    khanda: z.number(),
    koda: z.number(),
    nakkhi: z.number(),
    silkyKoda: z.number(),
    bhusa: z.number(),
})

export type StockByProducts = z.infer<typeof stockByProductsSchema>
