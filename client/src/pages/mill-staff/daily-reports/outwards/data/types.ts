/**
 * Daily Outward Types
 * TypeScript type definitions for Daily Outward module
 */

// ==========================================
// Status Types
// ==========================================

export type DailyOutwardStatus =
    | 'pending'
    | 'completed'
    | 'dispatched'
    | 'cancelled'

export interface DailyOutwardStatusOption {
    label: string
    value: DailyOutwardStatus
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyOutwardRequest {
    date: string
    gatePassNumber: string
    partyName: string
    item: string
    vehicleNumber: string
    bags: number
    weight: number
    driverName?: string
    status: DailyOutwardStatus
    remarks?: string
}

export interface UpdateDailyOutwardRequest {
    id: string
    date?: string
    gatePassNumber?: string
    partyName?: string
    item?: string
    vehicleNumber?: string
    bags?: number
    weight?: number
    driverName?: string
    status?: DailyOutwardStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyOutwardResponse {
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
    status: DailyOutwardStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailyOutwardListResponse {
    data: DailyOutwardResponse[]
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

export interface DailyOutwardSummaryResponse {
    totalEntries: number
    totalBags: number
    totalWeight: number
    statusCounts: {
        pending: number
        completed: number
        dispatched: number
        cancelled: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyOutwardQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: DailyOutwardStatus
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface DailyOutwardFormData {
    date: string
    gatePassNumber: string
    partyName: string
    item: string
    vehicleNumber: string
    bags: number
    weight: number
    driverName?: string
    status: DailyOutwardStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface DailyOutwardDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: DailyOutwardResponse | null
    selectedRows: DailyOutwardResponse[]
}
