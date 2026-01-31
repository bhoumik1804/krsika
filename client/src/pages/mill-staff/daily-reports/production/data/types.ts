/**
 * Daily Production Types
 * TypeScript type definitions for Daily Production module
 */

// ==========================================
// Status Types
// ==========================================

export type DailyProductionStatus =
    | 'pending'
    | 'verified'
    | 'stocked'
    | 'rejected'

export interface DailyProductionStatusOption {
    label: string
    value: DailyProductionStatus
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyProductionRequest {
    date: string
    itemName: string
    itemType: string
    bags: number
    weight: number
    warehouse: string
    stackNumber?: string
    status: DailyProductionStatus
    remarks?: string
}

export interface UpdateDailyProductionRequest {
    id: string
    date?: string
    itemName?: string
    itemType?: string
    bags?: number
    weight?: number
    warehouse?: string
    stackNumber?: string
    status?: DailyProductionStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyProductionResponse {
    _id: string
    millId: string
    date: string
    itemName: string
    itemType: string
    bags: number
    weight: number
    warehouse: string
    stackNumber?: string
    status: DailyProductionStatus
    remarks?: string
    createdBy: {
        _id: string
        fullName: string
        email: string
    }
    updatedBy?: {
        _id: string
        fullName: string
        email: string
    }
    createdAt: string
    updatedAt: string
}

export interface DailyProductionListResponse {
    data: DailyProductionResponse[]
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

export interface DailyProductionSummaryResponse {
    totalEntries: number
    totalBags: number
    totalWeight: number
    statusCounts: {
        pending: number
        verified: number
        stocked: number
        rejected: number
    }
    itemTypeCounts: Record<string, number>
    warehouseCounts: Record<string, number>
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyProductionQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: DailyProductionStatus
    itemType?: string
    warehouse?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface DailyProductionFormData {
    date: string
    itemName: string
    itemType: string
    bags: number
    weight: number
    warehouse: string
    stackNumber?: string
    status: DailyProductionStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailyProductionDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailyProductionResponse | null
    selectedRows: DailyProductionResponse[]
}
