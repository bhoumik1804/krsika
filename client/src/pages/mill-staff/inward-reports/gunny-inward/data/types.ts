import { z } from 'zod'
import {
    gunnyInwardSchema,
    type GunnyInward as GunnyInwardBase,
} from './schema'

// API Response Types
export interface GunnyInwardListResponse {
    entries: GunnyInward[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

export interface GunnyInwardSummaryResponse {
    totalGunnyNew: number
    totalGunnyOld: number
    totalGunnyPlastic: number
}

// Query Parameters
export interface GunnyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// Form Schema for validation
export const gunnyInwardFormSchema = gunnyInwardSchema.extend({
    date: z.coerce.date(),
})

export type GunnyInwardFormValues = z.infer<typeof gunnyInwardFormSchema>

// Create/Update Request Types
export interface CreateGunnyInwardRequest {
    date: string
    gunnyPurchaseDealNumber?: string
    partyName?: string
    delivery?: string
    samitiSangrahan?: string
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
}

export interface UpdateGunnyInwardRequest extends CreateGunnyInwardRequest {
    _id: string
}

// Re-export schema type
export type GunnyInward = GunnyInwardBase
