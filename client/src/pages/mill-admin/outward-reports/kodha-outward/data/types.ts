import { type KodhaOutward } from './schema'

export type KodhaOutwardQueryParams = {
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

export type KodhaOutwardListResponse = {
    entries: KodhaOutward[]
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

export type KodhaOutwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalNetWeight: number
        totalTruckWeight: number
        totalGunnyWeight: number
    }
}

export type CreateKodhaOutwardRequest = Omit<KodhaOutward, '_id'>

export type UpdateKodhaOutwardRequest = Partial<Omit<KodhaOutward, '_id'>>
