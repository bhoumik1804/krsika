/**
 * Committee Report Types
 * TypeScript type definitions for Committee Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateCommitteeRequest {
    committeeName: string
    contactPerson?: string
    phone?: string
    email?: string
    address?: string
}

export interface UpdateCommitteeRequest {
    id?: string
    _id?: string
    committeeName?: string
    contactPerson?: string
    phone?: string
    email?: string
    address?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface CommitteeResponse {
    _id: string
    millId: string
    committeeName: string
    contactPerson?: string
    phone?: string
    email?: string
    address?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface CommitteeListResponse {
    data: CommitteeResponse[]
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

export interface CommitteeSummaryResponse {
    totalCommittees: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface CommitteeQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
