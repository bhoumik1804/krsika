/**
 * DO Report Types
 * TypeScript type definitions for DO Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateDoReportRequest {
    date: string
    samitiSangrahan?: string
    doNo?: string
    dhanMota?: number
    dhanPatla?: number
    dhanSarna?: number
    total?: number
}

export interface UpdateDoReportRequest {
    _id: string
    date?: string
    samitiSangrahan?: string
    doNo?: string
    dhanMota?: number
    dhanPatla?: number
    dhanSarna?: number
    total?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface DoReportResponse {
    _id: string
    millId: string
    date: string
    samitiSangrahan?: string
    doNo?: string
    dhanMota?: number
    dhanPatla?: number
    dhanSarna?: number
    total?: number
    createdAt: string
    updatedAt: string
}

export interface DoReportListResponse {
    reports: DoReportResponse[]
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
    totalEntries: number
    totalDhanMota: number
    totalDhanPatla: number
    totalDhanSarna: number
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
