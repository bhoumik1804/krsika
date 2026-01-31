/**
 * FRK Inward Types
 * TypeScript type definitions for FRK Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateFrkInwardRequest {
    date: string
    partyName: string
    totalWeight?: number
    rate?: number
    amount?: number
}

export interface UpdateFrkInwardRequest {
    id: string
    date?: string
    partyName?: string
    totalWeight?: number
    rate?: number
    amount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface FrkInwardResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    totalWeight?: number
    rate?: number
    amount?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface FrkInwardListResponse {
    data: FrkInwardResponse[]
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

export interface FrkInwardSummaryResponse {
    totalEntries: number
    totalWeight: number
    totalRate: number
    totalAmount: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface FrkInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    partyName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface FrkInwardFormData {
    date: string
    partyName: string
    totalWeight?: number
    rate?: number
    amount?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface FrkInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: FrkInwardResponse | null
    selectedRows: FrkInwardResponse[]
}
