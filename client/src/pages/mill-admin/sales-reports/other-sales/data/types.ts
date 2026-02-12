import { OtherSales } from './schema'

export interface OtherSalesQueryParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
}

export interface OtherSalesListResponse {
    otherSales: OtherSales[]
    total: number
}

export interface OtherSalesResponse {
    otherSale: OtherSales
}

export type CreateOtherSalesRequest = Omit<OtherSales, '_id'>
export type UpdateOtherSalesRequest = OtherSales
