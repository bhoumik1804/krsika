import type { PrivateRiceOutward } from './schema'

export type PrivateRiceOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    riceType?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?:
        | 'date'
        | 'partyName'
        | 'brokerName'
        | 'truckNumber'
        | 'riceType'
        | 'netWeight'
        | 'createdAt'
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
        totalGunnyNew: number
        totalGunnyOld: number
        totalGunnyPlastic: number
        totalJuteWeight: number
        totalPlasticWeight: number
        totalTruckWeight: number
        totalGunnyWeight: number
        totalNetWeight: number
    }
}

export type CreatePrivateRiceOutwardRequest = Omit<PrivateRiceOutward, '_id'>
export type UpdatePrivateRiceOutwardRequest = Partial<CreatePrivateRiceOutwardRequest>
