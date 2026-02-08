import { z } from 'zod'
import { riceInwardSchema, type RiceInward as RiceInwardBase } from './schema'

// API Response Types
export interface RiceInwardListResponse {
    entries: RiceInward[]
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

export interface RiceInwardSummaryResponse {
    totalRiceMotaNetWeight: number
    totalRicePatlaNetWeight: number
    totalRecords: number
}

// Query Parameters
export interface RiceInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// Form Schema for validation
export const riceInwardFormSchema = riceInwardSchema.extend({
    date: z.coerce.date(),
})

export type RiceInwardFormValues = z.infer<typeof riceInwardFormSchema>

// Create/Update Request Types
export interface CreateRiceInwardRequest {
    date: string
    ricePurchaseNumber?: string
    partyName?: string
    brokerName?: string
    riceType?: string
    balanceInward?: number
    inwardType?: string
    lotNumber?: string
    frkOrNAN?: string
    gunnyOption?: string
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
    juteWeight?: number
    plasticWeight?: number
    gunnyWeight?: number
    truckNumber?: string
    rstNumber?: string
    truckLoadWeight?: number
    riceMotaNetWeight?: number
    ricePatlaNetWeight?: number
}

export interface UpdateRiceInwardRequest extends CreateRiceInwardRequest {
    _id: string
}

// Re-export schema type
export type RiceInward = RiceInwardBase
