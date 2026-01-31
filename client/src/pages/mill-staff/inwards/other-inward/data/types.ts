/**
 * Other Inward Types
 * TypeScript type definitions for Other Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOtherInwardRequest {
    date: string
    partyName: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
}

export interface UpdateOtherInwardRequest {
    id: string
    date?: string
    partyName?: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface OtherInwardResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface OtherInwardListResponse {
    data: OtherInwardResponse[]
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

export interface OtherInwardSummaryResponse {
    totalEntries: number
    totalQuantity: number
    totalRate: number
    totalAmount: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface OtherInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    itemName?: string
    unit?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface OtherInwardFormData {
    date: string
    partyName: string
    itemName?: string
    quantity?: number
    unit?: string
    rate?: number
    amount?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface OtherInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: OtherInwardResponse | null
    selectedRows: OtherInwardResponse[]
}
