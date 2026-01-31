/**
 * Daily Inward Types
 * TypeScript type definitions for Daily Inward module
 */

// ==========================================
// Status Types
// ==========================================

export type DailyInwardStatus =
    | 'pending'
    | 'completed'
    | 'verified'
    | 'rejected'

export interface DailyInwardStatusOption {
    label: string
    value: DailyInwardStatus
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyInwardRequest {
    date: string
    gatePassNumber: string
    partyName: string
    item: string
    vehicleNumber: string
    bags: number
    weight: number
    driverName?: string
    status: DailyInwardStatus
    remarks?: string
}

export interface UpdateDailyInwardRequest {
    id: string
    date?: string
    gatePassNumber?: string
    partyName?: string
    item?: string
    vehicleNumber?: string
    bags?: number
    weight?: number
    driverName?: string
    status?: DailyInwardStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyInwardResponse {
    _id: string
    millId: string
    date: string
    gatePassNumber: string
    partyName: string
    item: string
    vehicleNumber: string
    bags: number
    weight: number
    driverName?: string
    status: DailyInwardStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailyInwardListResponse {
    data: DailyInwardResponse[]
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

export interface DailyInwardSummaryResponse {
    totalEntries: number
    totalBags: number
    totalWeight: number
    statusCounts: {
        pending: number
        completed: number
        verified: number
        rejected: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyInwardQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: DailyInwardStatus
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface DailyInwardFormData {
    date: string
    gatePassNumber: string
    partyName: string
    item: string
    vehicleNumber: string
    bags: number
    weight: number
    driverName?: string
    status: DailyInwardStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailyInwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailyInwardResponse | null
    selectedRows: DailyInwardResponse[]
}
