import type { PaginationState, SortingState } from '@tanstack/react-table'
import { apiClient } from '@/lib/api-client'
import type {
    PaddySales,
    PaddySalesListResponse,
    PaddySalesSummary,
} from './types'

export const createPaddySale = async (millId: string, data: PaddySales) => {
    const response = await apiClient.post(`/mills/${millId}/paddy-sales`, data)
    return response.data.data
}

export const getPaddySales = async (
    millId: string,
    pagination: PaginationState,
    sorting: SortingState,
    search: string,
    filters: Record<string, unknown>
) => {
    const { pageIndex, pageSize } = pagination
    const sortBy = sorting[0]?.id || 'date'
    const order = sorting[0]?.desc ? 'desc' : 'asc'

    const response = await apiClient.get<{ data: PaddySalesListResponse }>(
        `/mills/${millId}/paddy-sales`,
        {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
                search,
                sortBy,
                order,
                ...filters,
            },
        }
    )
    return response.data.data
}

export const getPaddySaleSummary = async (
    millId: string,
    filters: Record<string, unknown>
) => {
    const response = await apiClient.get(
        `/mills/${millId}/paddy-sales/summary`,
        {
            params: filters,
        }
    )
    return response.data.data as PaddySalesSummary
}

export const updatePaddySale = async (
    millId: string,
    id: string,
    data: PaddySales
) => {
    const response = await apiClient.put(
        `/mills/${millId}/paddy-sales/${id}`,
        data
    )
    return response.data.data
}

export const deletePaddySale = async (millId: string, id: string) => {
    const response = await apiClient.delete(
        `/mills/${millId}/paddy-sales/${id}`
    )
    return response.data.data
}

export const deleteBulkPaddySales = async (millId: string, ids: string[]) => {
    const response = await apiClient.delete(
        `/mills/${millId}/paddy-sales/bulk`,
        {
            data: { ids },
        }
    )
    return response.data.data
}
