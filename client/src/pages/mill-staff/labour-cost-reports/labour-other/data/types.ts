/**
 * Labour Other Types
 * TypeScript type definitions for Labour Other module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateLabourOtherRequest {
    date: string
    labourType?: string
    labourGroupName?: string
    numberOfGunny?: number
    labourRate?: number
    workDetail?: string
    totalPrice?: number
}

export interface UpdateLabourOtherRequest {
    id: string
    date?: string
    labourType?: string
    labourGroupName?: string
    numberOfGunny?: number
    labourRate?: number
    workDetail?: string
    totalPrice?: number
}

// ==========================================
// API Response Types
// ==========================================

export interface LabourOtherResponse {
    _id: string
    millId: string
    date: string
    labourType?: string
    labourGroupName?: string
    numberOfGunny?: number
    labourRate?: number
    workDetail?: string
    totalPrice?: number
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface LabourOtherListResponse {
    data: LabourOtherResponse[]
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

export interface LabourOtherSummaryResponse {
    totalEntries: number
    totalGunny: number
    totalCost: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface LabourOtherQueryParams {
    page?: number
    limit?: number
    search?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
