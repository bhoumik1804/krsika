import type { GovtPaddyInward } from './schema'

export interface GovtPaddyInwardListResponse {
    data: GovtPaddyInward[]
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

export interface GovtPaddyInwardSummaryResponse {
    totalEntries: number
    totalPaddyMota: number
    totalPaddyPatla: number
    totalPaddySarna: number
    totalPaddyMahamaya: number
    totalPaddyRbGold: number
}

export interface GovtPaddyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: 'date' | 'doNumber' | 'committeeName' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type CreateGovtPaddyInwardRequest = Omit<
    GovtPaddyInward,
    '_id' | 'createdAt' | 'updatedAt'
>

export type UpdateGovtPaddyInwardRequest = Partial<
    Omit<GovtPaddyInward, '_id' | 'createdAt' | 'updatedAt'>
>
