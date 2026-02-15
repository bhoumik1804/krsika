import { type MillingPaddy } from './schema'

export type MillingPaddyResponse = MillingPaddy

export type MillingPaddyListResponse = {
    data: MillingPaddy[]
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

export type MillingPaddySummaryResponse = {
    totalEntries: number
    totalInput: number
    totalOutput: number
}

export type CreateMillingPaddyRequest = Omit<MillingPaddy, '_id'>

export type UpdateMillingPaddyRequest = Partial<MillingPaddy> & {
    id: string
}

export type MillingPaddyQueryParams = {
    page?: number
    limit?: number
    search?: string
    paddyType?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
