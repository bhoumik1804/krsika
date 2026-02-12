import { FrkOutward } from './schema'

// Query parameters for fetching FRK outward records
export interface FrkOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// API Response Types
export interface FrkOutwardListResponse {
    entries: FrkOutward[]
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

export interface FrkOutwardSummaryResponse {
    summary: {
        totalEntries: number
        totalGunnyPlastic: number
        totalPlasticWeight: number
        totalTruckWeight: number
        totalGunnyWeight: number
        totalNetWeight: number
    }
}

// Request Types for Mutations
export type CreateFrkOutwardRequest = Omit<FrkOutward, '_id'>

export type UpdateFrkOutwardRequest = Partial<Omit<FrkOutward, '_id'>>
