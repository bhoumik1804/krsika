import { PrivateGunnyOutward } from './schema'

// Query parameters for fetching private gunny outward records
export interface PrivateGunnyOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// API Response Types
export interface PrivateGunnyOutwardListResponse {
    entries: PrivateGunnyOutward[]
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

export interface PrivateGunnyOutwardSummaryResponse {
    summary: {
        totalEntries: number
        totalNewGunnyQty: number
        totalOldGunnyQty: number
        totalPlasticGunnyQty: number
    }
}

// Request Types for Mutations
export type CreatePrivateGunnyOutwardRequest = Omit<PrivateGunnyOutward, '_id'>

export type UpdatePrivateGunnyOutwardRequest = Partial<
    Omit<PrivateGunnyOutward, '_id'>
>
