import { z } from 'zod'

// ==========================================
// Form Schema (for validation)
// ==========================================

export const gunnyPurchaseFormSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    partyName: z.string().optional(),
    deliveryType: z.string().optional(),
    newGunnyQty: z.number().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type GunnyPurchaseFormData = z.infer<typeof gunnyPurchaseFormSchema>

// ==========================================
// Display/Table Schema
// ==========================================

export const gunnyPurchaseSchema = z.object({
    _id: z.string(),
    date: z.string(),
    gunnyPurchaseDealNumber: z.string().optional(),
    partyName: z.string().optional(),
    deliveryType: z.string().optional(),
    newGunnyQty: z.number().optional(),
    newGunnyRate: z.number().optional(),
    oldGunnyQty: z.number().optional(),
    oldGunnyRate: z.number().optional(),
    plasticGunnyQty: z.number().optional(),
    plasticGunnyRate: z.number().optional(),
})

export type GunnyPurchaseData = z.infer<typeof gunnyPurchaseSchema>
