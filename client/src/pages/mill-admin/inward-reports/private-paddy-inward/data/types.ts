import { z } from 'zod'
import {
    privatePaddyInwardSchema,
    type PrivatePaddyInward as PrivatePaddyInwardBase,
} from './schema'

// API Response Types
export interface PrivatePaddyInwardListResponse {
    entries: PrivatePaddyInward[]
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

export interface PrivatePaddyInwardSummaryResponse {
    totalEntries: number
    totalBags: number
    totalWeight: number
}

// Query Parameters
export interface PrivatePaddyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// Form Schema for validation
export const privatePaddyInwardFormSchema = privatePaddyInwardSchema.extend({
    date: z.coerce.date(),
})

export type PrivatePaddyInwardFormValues = z.infer<
    typeof privatePaddyInwardFormSchema
>

// Create/Update Request Types
export interface CreatePrivatePaddyInwardRequest {
    date: string
    paddyPurchaseDealNumber?: string
    partyName?: string
    brokerName?: string
    balanceDo?: number
    purchaseType?: string
    doNumber?: string
    committeeName?: string
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
    paddyType?: string
    paddyMota?: number
    paddyPatla?: number
    paddySarna?: number
    paddyMahamaya?: number
    paddyRbGold?: number
}

export interface UpdatePrivatePaddyInwardRequest extends CreatePrivatePaddyInwardRequest {}

// Re-export schema type
export type PrivatePaddyInward = PrivatePaddyInwardBase
