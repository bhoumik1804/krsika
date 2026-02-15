import { type LabourMilling } from './schema'

export type LabourMillingResponse = LabourMilling

export type LabourMillingListResponse = {
    entries: LabourMilling[]
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

export type LabourMillingSummaryResponse = {
    totalEntries: number
    totalHopperInGunny: number
}

export type CreateLabourMillingRequest = Omit<LabourMilling, '_id'>

export type UpdateLabourMillingRequest = Partial<LabourMilling> & {
    id: string
}

export type LabourMillingQueryParams = {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
