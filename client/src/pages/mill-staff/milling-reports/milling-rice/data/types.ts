import { type MillingRice } from './schema'

export type MillingRiceResponse = MillingRice

export type MillingRiceListResponse = {
    data: MillingRice[]
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

export type MillingRiceSummaryResponse = {
    totalEntries: number
    totalInput: number
    totalOutput: number
}

export type CreateMillingRiceRequest = Omit<MillingRice, '_id'>

export type UpdateMillingRiceRequest = Partial<MillingRice> & {
    id: string
}

export type MillingRiceQueryParams = {
    page?: number
    limit?: number
    search?: string
    riceType?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
