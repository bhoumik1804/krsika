import { z } from 'zod'

// Schema for VehicleReport records
export const vehicleReportSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    truckNo: z.string().min(1, 'Truck number is required'),
})

export type VehicleReportData = z.infer<typeof vehicleReportSchema>
