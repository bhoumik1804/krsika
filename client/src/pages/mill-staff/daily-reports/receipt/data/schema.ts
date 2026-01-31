import { z } from 'zod'

// Schema for Daily Receipt Entries
export const receiptSchema = z.object({
    id: z.string(),
    date: z.string(),
    voucherNumber: z.string(),
    partyName: z.string(),
    amount: z.number(),
    paymentMode: z.enum(['Cash', 'Bank', 'Cheque', 'UPI']),
    purpose: z.string(),
    status: z.enum(['pending', 'cleared', 'cancelled', 'bounced']),
    remarks: z.string().optional(),
})

export type ReceiptEntry = z.infer<typeof receiptSchema>
