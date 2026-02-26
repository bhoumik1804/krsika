import type { PrivateRiceOutward } from './schema'

export type { PrivateRiceOutward }

export type PrivateRiceOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    riceType?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export type PrivateRiceOutwardListResponse = {
    entries: PrivateRiceOutward[]
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

export type PrivateRiceOutwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalRiceQty: number
        totalNetWeight: number
        balance: number
    }
}

export type CreatePrivateRiceOutwardRequest = Omit<
    PrivateRiceOutward,
    '_id' | 'outwardData'
>
export type UpdatePrivateRiceOutwardRequest =
    Partial<CreatePrivateRiceOutwardRequest>
