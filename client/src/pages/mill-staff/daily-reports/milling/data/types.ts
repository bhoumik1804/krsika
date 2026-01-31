/**
 * Daily Milling Types
 * TypeScript type definitions for Daily Milling module
 */

// ==========================================
// Status Types
// ==========================================

export type DailyMillingStatus =
    | 'scheduled'
    | 'in-progress'
    | 'completed'
    | 'halted'

export type DailyMillingShift = 'Day' | 'Night'

export interface DailyMillingStatusOption {
    label: string
    value: DailyMillingStatus
}

export interface DailyMillingShiftOption {
    label: string
    value: DailyMillingShift
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateDailyMillingRequest {
    date: string
    shift: DailyMillingShift
    paddyType: string
    paddyQuantity: number // Qtl
    riceYield: number // Kg
    brokenYield: number // Kg
    branYield: number // Kg
    huskYield: number // Kg
    status: DailyMillingStatus
    remarks?: string
}

export interface UpdateDailyMillingRequest {
    id: string
    date?: string
    shift?: DailyMillingShift
    paddyType?: string
    paddyQuantity?: number
    riceYield?: number
    brokenYield?: number
    branYield?: number
    huskYield?: number
    status?: DailyMillingStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface DailyMillingResponse {
    _id: string
    millId: string
    date: string
    shift: DailyMillingShift
    paddyType: string
    paddyQuantity: number
    riceYield: number
    brokenYield: number
    branYield: number
    huskYield: number
    status: DailyMillingStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface DailyMillingListResponse {
    data: DailyMillingResponse[]
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

export interface DailyMillingSummaryResponse {
    totalEntries: number
    totalPaddyQuantity: number
    totalRiceYield: number
    totalBrokenYield: number
    totalBranYield: number
    totalHuskYield: number
    statusCounts: {
        scheduled: number
        'in-progress': number
        completed: number
        halted: number
    }
    shiftCounts: {
        Day: number
        Night: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface DailyMillingQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: DailyMillingStatus
    shift?: DailyMillingShift
    startDate?: string
    endDate?: string
    sortBy?: 'date' | 'paddyType' | 'paddyQuantity' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Constants
// ==========================================

export const DAILY_MILLING_STATUS_OPTIONS: DailyMillingStatusOption[] = [
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Halted', value: 'halted' },
]

export const DAILY_MILLING_SHIFT_OPTIONS: DailyMillingShiftOption[] = [
    { label: 'Day', value: 'Day' },
    { label: 'Night', value: 'Night' },
]
