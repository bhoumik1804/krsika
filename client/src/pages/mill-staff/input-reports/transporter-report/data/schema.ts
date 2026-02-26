import { z } from 'zod'

// Schema for TransporterReport records
export const transporterReportSchema = z.object({
    _id: z.string().optional(),
    transporterName: z.string().min(1, 'Transporter name is required'),
    gstn: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
})

export type TransporterReportData = z.infer<typeof transporterReportSchema>
