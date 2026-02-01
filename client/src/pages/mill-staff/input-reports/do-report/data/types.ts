/**
 * DO Report Types
 * TypeScript type definitions for DO Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateDoReportRequest {
    doNumber: string
    date: string
    partyName?: string
    itemType?: string
    quantity?: number
    validFrom?: string
    validTo?: string
}

export interface UpdateDoReportRequest {
    id?: string
    _id?: string
    doNumber?: string
    date?: string
    partyName?: string
    itemType?: string
    quantity?: number
    validFrom?: string
    validTo?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DoReportResponse {
    _id: string
    millId: string
    doNumber: string
    date: string
    partyName?: string
    itemType?: string
    quantity?: number
    validFrom?: string
    validTo?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DoReportListResponse {
    data: DoReportResponse[]
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

export interface DoReportSummaryResponse {
    totalDoReports: number
    totalQuantity: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface DoReportQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
