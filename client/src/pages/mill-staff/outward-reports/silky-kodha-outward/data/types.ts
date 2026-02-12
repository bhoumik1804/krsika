import type { SilkyKodhaOutward } from './schema'

export type SilkyKodhaOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?:
        | 'date'
        | 'partyName'
        | 'brokerName'
        | 'truckNo'
        | 'netWeight'
        | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type SilkyKodhaOutwardListResponse = {
    entries: SilkyKodhaOutward[]
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

export type SilkyKodhaOutwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalGunnyPlastic: number
        totalPlasticWeight: number
        totalTruckWeight: number
        totalGunnyWeight: number
        totalNetWeight: number
    }
}

export type CreateSilkyKodhaOutwardRequest = Omit<SilkyKodhaOutward, '_id'>
export type UpdateSilkyKodhaOutwardRequest =
    Partial<CreateSilkyKodhaOutwardRequest>
