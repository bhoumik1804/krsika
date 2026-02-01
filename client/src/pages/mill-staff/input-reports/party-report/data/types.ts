/**
 * Party Report Types
 * TypeScript type definitions for Party Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreatePartyRequest {
    partyName: string
    gstn?: string
    phone?: string
    email?: string
    address?: string
}

export interface UpdatePartyRequest {
    id?: string
    _id?: string
    partyName?: string
    gstn?: string
    phone?: string
    email?: string
    address?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface PartyResponse {
    _id: string
    millId: string
    partyName: string
    gstn?: string
    phone?: string
    email?: string
    address?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface PartyListResponse {
    data: PartyResponse[]
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

export interface PartySummaryResponse {
    totalParties: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface PartyQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
