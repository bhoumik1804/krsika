import type { FrkInward } from './schema'

export interface FrkInwardListResponse {
    entries: FrkInward[]
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

export interface FrkInwardSummaryResponse {
    totalEntries: number
    totalNetWeight: number
}

export interface FrkInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: 'date' | 'partyName' | 'netWeight' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type CreateFrkInwardRequest = Omit<
    FrkInward,
    '_id' | 'createdAt' | 'updatedAt'
>

export type UpdateFrkInwardRequest = Partial<
    Omit<FrkInward, '_id' | 'createdAt' | 'updatedAt'>
>
