import type { OtherOutward } from './schema'

export type OtherOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    itemName?: string
    startDate?: string
    endDate?: string
    sortBy?:
        | 'date'
        | 'partyName'
        | 'brokerName'
        | 'itemName'
        | 'truckNo'
        | 'netWeight'
        | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type OtherOutwardListResponse = {
    entries: OtherOutward[]
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

export type OtherOutwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalQuantity: number
        totalGunnyNew: number
        totalGunnyOld: number
        totalGunnyPlastic: number
        totalJuteGunnyWeight: number
        totalPlasticGunnyWeight: number
        totalTruckWeight: number
        totalGunnyWeight: number
        totalNetWeight: number
    }
}

export type CreateOtherOutwardRequest = Omit<OtherOutward, '_id'>
export type UpdateOtherOutwardRequest = Partial<CreateOtherOutwardRequest>
