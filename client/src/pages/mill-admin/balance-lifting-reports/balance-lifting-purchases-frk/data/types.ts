import type { BalanceLiftingPurchasesFrk } from './schema'

// API Request/Response types for Balance Lifting FRK Purchase

export interface BalanceLiftingFrkPurchaseRequest {
    date: string
    partyName: string
    frkQty?: number
    frkRate?: number
    gst?: number
}

export interface BalanceLiftingFrkPurchaseResponse {
    _id: string
    date: string
    partyName: string
    frkQty?: number
    frkRate?: number
    gst?: number
    millId?: string
    createdBy?: string
    createdAt?: string
    updatedAt?: string
    __v?: number
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

export interface BalanceLiftingFrkPurchaseListResponse {
    data: BalanceLiftingPurchasesFrk[]
    pagination: PaginationData
}
