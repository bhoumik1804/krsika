import { type PaddySales } from './schema'

export interface PaddySalesResponse extends PaddySales {
    _id: string
    createdAt: string
    updatedAt: string
}

export interface PaddySalesListResponse {
    data: PaddySalesResponse[]
    total: number
    pageSize: number
    currentPage: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
}

export type PaddySalesSummary = {
    totalDhanMotaQty: number
    totalDhanPatlaQty: number
    totalDhanSarnaQty: number
    totalDhanQty: number
    count: number
}
