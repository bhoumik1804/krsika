import type { NakkhiOutward } from './schema'

export type NakkhiOutwardQueryParams = {
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

export type NakkhiOutwardListResponse = {
    entries: NakkhiOutward[]
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

export type NakkhiOutwardSummaryResponse = {
    totalEntries: number
    totalNetWeight: number
}

export type CreateNakkhiOutwardRequest = Omit<NakkhiOutward, '_id'>

export type UpdateNakkhiOutwardRequest = Partial<CreateNakkhiOutwardRequest>
