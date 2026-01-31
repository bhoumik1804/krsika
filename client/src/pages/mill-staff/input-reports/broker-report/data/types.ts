/**
 * Broker Report Types
 * TypeScript type definitions for Broker Report module
 */

// ==========================================
// API Request Types
// ==========================================

export interface CreateBrokerRequest {
    brokerName: string
    phone?: string
    email?: string
    address?: string
}

export interface UpdateBrokerRequest {
    id: string
    brokerName?: string
    phone?: string
    email?: string
    address?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface BrokerResponse {
    _id: string
    millId: string
    brokerName: string
    phone?: string
    email?: string
    address?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface BrokerListResponse {
    data: BrokerResponse[]
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

export interface BrokerSummaryResponse {
    totalBrokers: number
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BrokerQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
