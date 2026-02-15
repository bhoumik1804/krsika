import { type LabourOutward } from './schema'

export type LabourOutwardResponse = LabourOutward

export type LabourOutwardListResponse = {
    entries: LabourOutward[]
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

export type LabourOutwardSummaryResponse = {
    totalEntries: number
    totalGunny: number
    totalBundles: number
}

export type CreateLabourOutwardRequest = Omit<LabourOutward, '_id'>

export type UpdateLabourOutwardRequest = Partial<LabourOutward> & {
    id: string
}

export type LabourOutwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
