/**
 * Labour Milling Types
 * TypeScript type definitions for Labour Milling module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateLabourMillingRequest {
    date: string
    hopperInGunny?: number
    hopperRate?: number
    labourGroupName?: string
}

export interface UpdateLabourMillingRequest {
    id: string
    date?: string
    hopperInGunny?: number
    hopperRate?: number
    labourGroupName?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface LabourMillingResponse {
    _id: string
    millId: string
    date: string
    hopperInGunny?: number
    hopperRate?: number
    labourGroupName?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface LabourMillingListResponse {
    data: LabourMillingResponse[]
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

export interface LabourMillingSummaryResponse {
    totalEntries: number
    totalHopperGunny: number
    totalHopperCost: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface LabourMillingQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
