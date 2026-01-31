/**
 * Stock Overview Types
 * TypeScript type definitions for Stock Overview module
 */
import { z } from 'zod'
import { stockOverviewSchema } from './schema'

// ==========================================
// Base Types (from schema)
// ==========================================

export type StockOverview = z.infer<typeof stockOverviewSchema>

// ==========================================
// Status Types
// ==========================================

export type StockOverviewStatus = 'pending' | 'completed' | 'cancelled'

export interface StockOverviewStatusOption {
    label: string
    value: StockOverviewStatus
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateStockOverviewRequest {
    date: string
    partyName: string
    vehicleNumber: string
    bags: number
    weight: number
    rate: number
    amount: number
    status: StockOverviewStatus
    remarks?: string
}

export interface UpdateStockOverviewRequest {
    id: string
    date?: string
    partyName?: string
    vehicleNumber?: string
    bags?: number
    weight?: number
    rate?: number
    amount?: number
    status?: StockOverviewStatus
    remarks?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface StockOverviewResponse {
    _id: string
    millId: string
    date: string
    partyName: string
    vehicleNumber: string
    bags: number
    weight: number
    rate: number
    amount: number
    status: StockOverviewStatus
    remarks?: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export interface StockOverviewListResponse {
    data: StockOverviewResponse[]
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

export interface StockOverviewSummaryResponse {
    totalEntries: number
    totalBags: number
    totalWeight: number
    totalAmount: number
    statusCounts: {
        pending: number
        completed: number
        cancelled: number
    }
}

// ==========================================
// Query Parameters
// ==========================================

export interface StockOverviewQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: StockOverviewStatus
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// Form Types
// ==========================================

export interface StockOverviewFormData {
    date: string
    partyName: string
    vehicleNumber: string
    bags: number
    weight: number
    rate: number
    amount: number
    status: StockOverviewStatus
    remarks?: string
}

// ==========================================
// Dialog State Types
// ==========================================

export interface StockOverviewDialogState {
    open: 'create' | 'edit' | 'delete' | 'bulk-delete' | null
    currentRow: StockOverviewResponse | null
    selectedRows: StockOverviewResponse[]
}
