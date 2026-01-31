/**
 * Gunny Inward Types
 * TypeScript type definitions for Gunny Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateGunnyInwardRequest {
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
}

export interface UpdateGunnyInwardRequest {
    id: string
    date?: string
    partyName?: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface GunnyInwardResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface GunnyInwardListResponse {
    data: GunnyInwardResponse[]
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

export interface GunnyInwardSummaryResponse {
    totalEntries: number
    totalGunny: number
    totalRate: number
    totalAmount: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface GunnyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    gunnyType?: string
    partyName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface GunnyInwardFormData {
    date: string
    partyName: string
    gunnyType?: string
    totalGunny?: number
    rate?: number
    amount?: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface GunnyInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: GunnyInwardResponse | null
    selectedRows: GunnyInwardResponse[]
}
