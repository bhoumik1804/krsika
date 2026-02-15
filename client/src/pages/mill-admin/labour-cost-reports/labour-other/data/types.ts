import { type LabourOther } from './schema'

export type LabourOtherResponse = LabourOther

export type LabourOtherListResponse = {
    entries: LabourOther[]
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

export type LabourOtherSummaryResponse = {
    totalEntries: number
    totalPrice: number
}

export type CreateLabourOtherRequest = Omit<LabourOther, '_id'>

export type UpdateLabourOtherRequest = Partial<LabourOther> & {
    id: string
}

export type LabourOtherQueryParams = {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
