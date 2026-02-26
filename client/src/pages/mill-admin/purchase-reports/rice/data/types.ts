import type { RicePurchaseData } from './schema'

export interface RicePurchaseResponse extends RicePurchaseData {
    _id: string
    millId?: string
    ricePurchaseDealNumber?: string
    createdAt?: string
    updatedAt?: string
}

export interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
}

export interface RicePurchaseListResponse {
    data: RicePurchaseResponse[]
    pagination: PaginationData
}

export interface RicePurchaseQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
