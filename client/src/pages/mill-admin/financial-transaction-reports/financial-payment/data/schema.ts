import { z } from 'zod'

export const FinancialPaymentSchema = z.object({
    date: z.string(),
    paymentType: z.string().nullable().optional(),
    partyName: z.string().nullable().optional(),
    brokerName: z.string().nullable().optional(),
    purchaseDealType: z.string().nullable().optional(),
    purchaseDealNumber: z.string().nullable().optional(),
    transporterName: z.string().nullable().optional(),
    truckNumber: z.string().nullable().optional(),
    diesel: z.number().optional(),
    bhatta: z.number().optional(),
    repairOrMaintenance: z.number().optional(),
    labourType: z.string().nullable().optional(),
    labourGroupName: z.string().nullable().optional(),
    staffName: z.string().nullable().optional(),
    salary: z.number().optional(),
    month: z.string().nullable().optional(),
    attendance: z.number().optional(),
    allowedLeave: z.number().optional(),
    payableSalary: z.number().optional(),
    salaryPayment: z.number().optional(),
    advancePayment: z.number().optional(),
    remarks: z.string().nullable().optional(),
    paymentAmount: z.number().optional(),
})

export type FinancialPayment = z.infer<typeof FinancialPaymentSchema>
