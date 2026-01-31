/**
 * Rice Inward Types
 * TypeScript type definitions for Rice Inward module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateRiceInwardRequest {
    date: string
    partyName: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    frk?: number
    sampleWeight?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    brokerName?: string
}

export interface UpdateRiceInwardRequest {
    id: string
    date?: string
    partyName?: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    frk?: number
    sampleWeight?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    brokerName?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface RiceInwardResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    frk?: number
    sampleWeight?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    brokerName?: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface RiceInwardListResponse {
    data: RiceInwardResponse[]
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

export interface RiceInwardSummaryResponse {
    totalEntries: number
    totalRiceGunny: number
    totalFrk: number
    totalSampleWeight: number
    totalGrossWeight: number
    totalTareWeight: number
    totalNetWeight: number
}

// ==========================================
// Query Parameters
// ==========================================

export interface RiceInwardQueryParams {
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

export interface RiceInwardFormData {
    date: string
    partyName: string
    riceType?: string
    truckNumber?: string
    riceGunny?: number
    frk?: number
    sampleWeight?: number
    grossWeight?: number
    tareWeight?: number
    netWeight?: number
    brokerName?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface RiceInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: RiceInwardResponse | null
    selectedRows: RiceInwardResponse[]
}
