/**
 * Milling Rice Types
 * TypeScript type definitions for Milling Rice module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateMillingRiceRequest {
    date: string
    riceLot?: string
    riceType?: string
    totalPaddy?: number
    totalRice?: number
    brokenRice?: number
    khurai?: number
    millRecovery?: number
}

export interface UpdateMillingRiceRequest {
    id: string
    date?: string
    riceLot?: string
    riceType?: string
    totalPaddy?: number
    totalRice?: number
    brokenRice?: number
    khurai?: number
    millRecovery?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface MillingRiceResponse {
    _id: string
    millId: string
    date: string
    riceLot?: string
    riceType?: string
    totalPaddy?: number
    totalRice?: number
    brokenRice?: number
    khurai?: number
    millRecovery?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface MillingRiceListResponse {
    data: MillingRiceResponse[]
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

export interface MillingRiceSummaryResponse {
    totalEntries: number
    totalPaddy: number
    totalRice: number
    totalBrokenRice: number
    totalKhurai: number
    avgMillRecovery: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface MillingRiceQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
