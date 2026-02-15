import type { FrkPurchaseData } from './schema'

// API Request/Response types for FRK Purchase

export interface FrkPurchaseRequest {
    date: string
    partyName: string
    frkPurchaseDealNumber?: string
    frkQty?: number
    frkRate?: number
    gst?: number
}

export interface FrkPurchaseResponse {
    _id: string
    date: string
    frkPurchaseDealNumber?: string
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

export interface FrkPurchaseListResponse {
    data: FrkPurchaseData[]
    pagination: PaginationData
}
