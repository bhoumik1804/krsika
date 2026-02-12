import type { KhandaOutward } from './schema'

export type KhandaOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?: 'date' | 'partyName' | 'brokerName' | 'truckNo' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type KhandaOutwardListResponse = {
    entries: KhandaOutward[]
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

export type KhandaOutwardSummaryResponse = {
    totalEntries: number
    totalNetWeight: number
}

export type CreateKhandaOutwardRequest = Omit<KhandaOutward, '_id'>

export type UpdateKhandaOutwardRequest = Partial<CreateKhandaOutwardRequest>
