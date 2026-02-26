import { type LabourInward } from './schema'

export type LabourInwardResponse = LabourInward

export type LabourInwardListResponse = {
    entries: LabourInward[]
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

export type LabourInwardSummaryResponse = {
    totalEntries: number
    totalGunny: number
    totalBundles: number
}

export type CreateLabourInwardRequest = Omit<LabourInward, '_id'>

export type UpdateLabourInwardRequest = Partial<LabourInward> & {
    id: string
}

export type LabourInwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
