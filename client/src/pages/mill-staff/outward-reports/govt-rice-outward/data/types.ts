import type { GovtRiceOutward } from './schema'

export type GovtRiceOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    riceType?: string
    lotNo?: string
    startDate?: string
    endDate?: string
    sortBy?: 'date' | 'lotNo' | 'riceType' | 'netWeight' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type GovtRiceOutwardListResponse = {
    data: GovtRiceOutward[]
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

export type GovtRiceOutwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalGunnyNew: number
        totalGunnyOld: number
        totalJuteWeight: number
        totalTruckWeight: number
        totalGunnyWeight: number
        totalNetWeight: number
    }
}

export type CreateGovtRiceOutwardRequest = Omit<GovtRiceOutward, '_id'>
export type UpdateGovtRiceOutwardRequest = Partial<CreateGovtRiceOutwardRequest>
