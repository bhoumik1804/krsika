import type { OtherInward } from './schema'

export type OtherInwardQueryParams = {
    page?: number
    limit?: number
    search?: string
    itemName?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?:
        | 'date'
        | 'partyName'
        | 'brokerName'
        | 'itemName'
        | 'quantity'
        | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export type OtherInwardListResponse = {
    entries: OtherInward[]
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

export type OtherInwardSummaryResponse = {
    summary: {
        totalEntries: number
        totalQuantity: number
        totalNetWeight: number
    }
}

export type CreateOtherInwardRequest = Omit<
    OtherInward,
    '_id' | 'otherPurchaseDealNumber'
>
export type UpdateOtherInwardRequest = Partial<CreateOtherInwardRequest>
