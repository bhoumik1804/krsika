/**
 * Other Purchase Types
 * TypeScript type definitions for Other Purchase module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOtherPurchaseRequest {
    date: string
    partyName?: string
    brokerName?: string
    otherPurchaseName?: string
    otherPurchaseQty?: number
    qtyType?: string
    rate?: number
    discountPercent?: number
    gst?: number
}

export interface UpdateOtherPurchaseRequest {
    date?: string
    partyName?: string
    brokerName?: string
    otherPurchaseName?: string
    otherPurchaseQty?: number
    qtyType?: string
    rate?: number
    discountPercent?: number
    gst?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface OtherPurchaseResponse {
    _id: string
    id?: string
    millId?: string
    date: string
    partyName?: string
    brokerName?: string
    otherPurchaseName?: string
    otherPurchaseQty?: number
    qtyType?: string
    rate?: number
    discountPercent?: number
    gst?: number
    createdAt?: string
    updatedAt?: string
}

export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface OtherPurchaseListResponse {
    purchases: OtherPurchaseResponse[]
    pagination: PaginationMeta
}

// ==========================================
// Delete Response Types
// ==========================================

export interface DeleteOtherPurchaseResponse {
    success: boolean
    message?: string
}

export interface BulkDeleteOtherPurchaseResponse {
    success: boolean
    deletedCount: number
    message?: string
}
