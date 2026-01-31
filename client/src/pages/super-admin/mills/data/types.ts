/**
 * Mills Types
 * TypeScript type definitions for Mills module (Super Admin)
 */

// ==========================================
// Status Types
// ==========================================

export type MillStatus =
    | 'PENDING_VERIFICATION'
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'REJECTED'

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
}

export interface MillContact {
    email: string
    phone: string
    address?: string
}

export interface MillSettings {
    currency: string
    taxPercentage: number
}

// ==========================================
// Plan Types
// ==========================================

export interface PlanReference {
    _id: string
    name: string
    price: number
    billingCycle: string
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateMillRequest {
    millName: string
    millInfo: MillInfo
    contact: MillContact
    status?: MillStatus
    currentPlan?: string
    planValidUntil?: string
    settings?: Partial<MillSettings>
}

export interface UpdateMillRequest {
    id: string
    millName?: string
    millInfo?: Partial<MillInfo>
    contact?: Partial<MillContact>
    status?: MillStatus
    currentPlan?: string
    planValidUntil?: string
    settings?: Partial<MillSettings>
}

export interface VerifyMillRequest {
    id: string
    status: 'ACTIVE' | 'REJECTED'
    rejectionReason?: string
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
    currentPlan: PlanReference | null
    planValidUntil: string | null
    settings: MillSettings
    createdAt: string
    updatedAt: string
}

export interface MillListResponse {
    data: MillResponse[]
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
