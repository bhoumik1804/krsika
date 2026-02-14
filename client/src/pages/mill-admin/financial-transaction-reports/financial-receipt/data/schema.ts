import { z } from 'zod'

export const FinancialReceiptSchema = z.object({
    date: z.string(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    salesDealType: z.string().nullable().optional(),
    salesDealNumber: z.string().nullable().optional(),
    receivedAmount: z.number().optional(),
    remarks: z.string().nullable().optional(),
})

export type FinancialReceipt = z.infer<typeof FinancialReceiptSchema>
