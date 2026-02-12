import type { PrivatePaddyOutward } from './schema'

export interface PrivatePaddyOutwardListResponse {
    entries: PrivatePaddyOutward[]
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

export interface PrivatePaddyOutwardSummaryResponse {
    totalEntries: number
    totalPaddyQty: number
    totalGunnyNew: number
    totalGunnyOld: number
    totalGunnyPlastic: number
    totalJuteWeight: number
    totalPlasticWeight: number
    totalTruckWeight: number
    totalGunnyWeight: number
    totalNetWeight: number
}

export interface PrivatePaddyOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    paddyType?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?:
        | 'date'
        | 'partyName'
        | 'brokerName'
        | 'truckNumber'
        | 'paddyType'
        | 'netWeight'
        | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type CreatePrivatePaddyOutwardRequest = Omit<
    PrivatePaddyOutward,
    '_id' | 'createdAt' | 'updatedAt'
>

export type UpdatePrivatePaddyOutwardRequest = Partial<
    Omit<PrivatePaddyOutward, '_id' | 'createdAt' | 'updatedAt'>
>
