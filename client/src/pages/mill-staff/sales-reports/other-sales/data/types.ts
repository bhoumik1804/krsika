import { OtherSales } from './schema'

export interface OtherSalesQueryParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
}

// Matches server response: { sales: [...], pagination: {...} }
export interface OtherSalesListResponse {
    sales: OtherSales[]
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

export interface OtherSalesResponse {
    sale: OtherSales
}

export type CreateOtherSalesRequest = Omit<OtherSales, '_id'>
export type UpdateOtherSalesRequest = OtherSales
