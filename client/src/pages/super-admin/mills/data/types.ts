/**
 * Mills Types
 * TypeScript type definitions for Mills module (Super Admin)
 */
import { MILL_STATUS } from '@/constants'

// ==========================================
// Status Types
// ==========================================

// 1. Define the type for the values first (if you haven't already)
export type MillStatus = (typeof MILL_STATUS)[keyof typeof MILL_STATUS]

// 2. Use that type in your interface
export interface MillStatusOption {
    label: string
    value: MillStatus
}

// ==========================================
// Mill Info Types
// ==========================================

export interface MillInfo {
    gstNumber: string
    panNumber: string
    mnmNumber: string
}

export interface MillContact {
    email: string
    phone: string
    address?: string
    city: string
    state: string
    pincode: string
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateMillRequest {
    millName: string
    millInfo: MillInfo
    contact: MillContact
    status?: MillStatus
}

export interface UpdateMillRequest {
    id: string
    millName?: string
    millInfo?: Partial<MillInfo>
    contact?: Partial<MillContact>
    status?: MillStatus
}

export type VerifyMillRequest =
    | {
          id: string
          status: typeof MILL_STATUS.ACTIVE
          rejectionReason?: never // Cannot provide reason if active
      }
    | {
          id: string
          status: typeof MILL_STATUS.REJECTED
          rejectionReason: string // REQUIRED if rejected
      }

// ==========================================
// API Response Types
// ==========================================

export interface MillResponse {
    _id: string
    millName: string
    millInfo: MillInfo
    contact: MillContact
    status: MillStatus
    createdAt: string
    updatedAt: string
}

export interface MillListResponse {
    mills: MillResponse[]
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

export interface MillSummaryResponse {
    totalMills: number
    statusCounts: {
        PENDING_VERIFICATION: number
        ACTIVE: number
        SUSPENDED: number
        REJECTED: number
    }
    recentMills: MillResponse[]
}

// ==========================================
// Query Parameters
// ==========================================

export interface MillQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: MillStatus
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface MillFormData {
    millName: string
    gstNumber: string
    panNumber: string
    email: string
    phone: string
    address?: string
    status: MillStatus
    currentPlan?: string
    planValidUntil?: string
    currency: string
    taxPercentage: number
}

// ==========================================
// Dialog State Types
// ==========================================

export interface MillDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | 'verify' | null
    currentRow: MillResponse | null
    selectedRows: MillResponse[]
}

// ==========================================
// Table Types (for frontend display)
// ==========================================

export interface MillTableRow {
    id: string
    name: string
    email: string
    phone: string
    location: string
    status: MillStatus
    planName: string | null
    planValidUntil: Date | null
    createdAt: Date
    updatedAt: Date
}
