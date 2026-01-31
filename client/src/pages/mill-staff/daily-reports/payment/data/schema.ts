import { z } from 'zod'

// Schema for Daily Payment Entries
export const paymentSchema = z.object({
    id: z.string(),
    date: z.string(),
    voucherNumber: z.string(),
    partyName: z.string(),
    amount: z.number(),
    paymentMode: z.enum(['Cash', 'Bank', 'Cheque', 'UPI']),
    purpose: z.string(),
    referenceNumber: z.string().optional(),
    status: z.enum(['pending', 'completed', 'cancelled', 'failed']),
    remarks: z.string().optional(),
})

export type PaymentEntry = z.infer<typeof paymentSchema>
