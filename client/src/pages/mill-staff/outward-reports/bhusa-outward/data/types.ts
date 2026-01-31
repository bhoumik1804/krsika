/**
 * Bhusa Outward Types
 * TypeScript type definitions for Bhusa Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBhusaOutwardRequest {
    date: string
    bhusaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    brokerage?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
}

export interface UpdateBhusaOutwardRequest {
    id: string
    date?: string
    bhusaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    brokerage?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface BhusaOutwardResponse {
    _id: string
    millId: string
    date: string
    bhusaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    brokerage?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface BhusaOutwardListResponse {
    data: BhusaOutwardResponse[]
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

export interface BhusaOutwardSummaryResponse {
    totalEntries: number
    totalRate: number
    totalBrokerage: number
    totalTruckWeight: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface BhusaOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    brokerName?: string
    bhusaSaleDealNumber?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface BhusaOutwardFormData {
    date: string
    bhusaSaleDealNumber?: string
    partyName?: string
    brokerName?: string
    rate?: number
    brokerage?: number
    truckNo?: string
    truckRst?: string
    truckWeight?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface BhusaOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: BhusaOutwardResponse | null
    selectedRows: BhusaOutwardResponse[]
}
