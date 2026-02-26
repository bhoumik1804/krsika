import type { GovtGunnyOutward } from './schema'

export type GovtGunnyOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    gunnyDmNumber?: string
    samitiSangrahan?: string
    startDate?: string
    endDate?: string
    sortBy?:
        | 'date'
        | 'gunnyDmNumber'
        | 'samitiSangrahan'
        | 'oldGunnyQty'
        | 'plasticGunnyQty'
        | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type GovtGunnyOutwardListResponse = {
    entries: GovtGunnyOutward[]
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

export type GovtGunnyOutwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalOldGunnyQty: number
        totalPlasticGunnyQty: number
    }
}

export type CreateGovtGunnyOutwardRequest = Omit<GovtGunnyOutward, '_id'>
export type UpdateGovtGunnyOutwardRequest =
    Partial<CreateGovtGunnyOutwardRequest>
