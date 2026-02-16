import type { BalanceLiftingPurchasesPaddy } from './schema'

// API Request/Response types for Balance Lifting Paddy Purchase

export interface BalanceLiftingPaddyPurchaseRequest {
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
}

export interface BalanceLiftingPaddyPurchaseResponse {
    _id: string
    date: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doNumber?: string
    committeeName?: string
    doPaddyQty?: number
    paddyType?: string
    totalPaddyQty?: number
    paddyRatePerQuintal?: number
    discountPercent?: number
    brokerage?: number
    gunnyType?: string
    newGunnyRate?: number
    oldGunnyRate?: number
    plasticGunnyRate?: number
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

export interface BalanceLiftingPaddyPurchaseListResponse {
    data: BalanceLiftingPurchasesPaddy[]
    pagination: PaginationData
}
