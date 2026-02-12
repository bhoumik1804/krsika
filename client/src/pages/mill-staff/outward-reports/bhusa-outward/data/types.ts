import type { BhusaOutward } from './schema'

export type BhusaOutwardQueryParams = {
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

export type BhusaOutwardListResponse = {
    entries: BhusaOutward[]
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

export type BhusaOutwardSummaryResponse = {
    totalEntries: number
    totalTruckWeight: number
}

export type CreateBhusaOutwardRequest = Omit<BhusaOutward, '_id'>

export type UpdateBhusaOutwardRequest = Partial<CreateBhusaOutwardRequest>
