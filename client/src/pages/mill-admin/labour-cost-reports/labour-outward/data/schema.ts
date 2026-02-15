import { z } from 'zod'

// Schema for LabourOutward records (जावक हमाली)
export const labourOutwardSchema = z.object({
    _id: z.string().optional(),
    date: z.string(), // दिनांक - DATE_FIELD
    outwardType: z.string().optional(), // जावक प्रकार - OUTWARD_TYP
    truckNumber: z.string().optional(), // ट्रक नं - TRUCK_NUM
    totalGunny: z.number().optional(), // बारदाना की संख्या - TOTAL_BAGS
    numberOfGunnyBundle: z.number().optional(), // बारदाना बंडल की संख्या - BUNDLE
    loadingRate: z.number().optional(), // लोडिंग दर - LOADING
    dhulaiRate: z.number().optional(), // धुलाई दर - DHULAI
    labourGroupName: z.string().optional(), // हमाल/रेजा टोली - HAMAL
})

export type LabourOutward = z.infer<typeof labourOutwardSchema>
