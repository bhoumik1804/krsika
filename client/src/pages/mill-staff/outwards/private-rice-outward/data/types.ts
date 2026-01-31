/**
 * Private Rice Outward Types
 * TypeScript type definitions for Private Rice Outward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreatePrivateRiceOutwardRequest {
    date: string
    partyName: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    rate?: number
    brokerName?: string
}

export interface UpdatePrivateRiceOutwardRequest {
    id: string
    date?: string
    partyName?: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    rate?: number
    brokerName?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface PrivateRiceOutwardResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    rate?: number
    brokerName?: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface PrivateRiceOutwardListResponse {
    data: PrivateRiceOutwardResponse[]
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

export interface PrivateRiceOutwardSummaryResponse {
    totalEntries: number
    totalRiceGunny: number
    totalGrossWeight: number
    totalTareWeight: number
    totalNetWeight: number
    totalRate: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface PrivateRiceOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    riceType?: string
    partyName?: string
    brokerName?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface PrivateRiceOutwardFormData {
    date: string
    partyName: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    rate?: number
    brokerName?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface PrivateRiceOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: PrivateRiceOutwardResponse | null
    selectedRows: PrivateRiceOutwardResponse[]
}
