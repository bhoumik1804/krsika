/**
 * Outward Balance Lifting Rice Types
 * TypeScript type definitions for Outward Balance Lifting Rice module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateOutwardBalanceLiftingRiceRequest {
    date: string
    partyName: string
    vehicleNumber: string
    bags: number
    weight: number
    rate: number
    amount: number
    status: 'pending' | 'completed' | 'cancelled'
    remarks?: string
}

export interface UpdateOutwardBalanceLiftingRiceRequest {
    id: string
    date?: string
    partyName?: string
    vehicleNumber?: string
    bags?: number
    weight?: number
    rate?: number
    amount?: number
    status?: 'pending' | 'completed' | 'cancelled'
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface OutwardBalanceLiftingRiceResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    vehicleNumber: string
    bags: number
    weight: number
    rate: number
    amount: number
    status: 'pending' | 'completed' | 'cancelled'
    remarks?: string
    createdBy: string
    createdByUser?: {
        fullName: string
        email: string
    }
    updatedBy?: string
    createdAt: string
    updatedAt: string
}

export interface OutwardBalanceLiftingRiceListResponse {
    data: OutwardBalanceLiftingRiceResponse[]
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

export interface OutwardBalanceLiftingRiceSummaryResponse {
    totalEntries: number
    totalBags: number
    totalWeight: number
    totalAmount: number
    pendingCount: number
    completedCount: number
    cancelledCount: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface OutwardBalanceLiftingRiceQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    status?: 'pending' | 'completed' | 'cancelled'
    startDate?: string
    endDate?: string
}
