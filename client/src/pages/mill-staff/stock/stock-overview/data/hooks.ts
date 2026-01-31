/**
 * Stock Overview Hooks
 * React Query hooks for Stock Overview data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchStockOverviewList,
    fetchStockOverviewById,
    fetchStockOverviewSummary,
    createStockOverview,
    updateStockOverview,
    deleteStockOverview,
    bulkDeleteStockOverview,
    exportStockOverview,
} from './service'
import type {
    StockOverviewResponse,
    StockOverviewListResponse,
    StockOverviewSummaryResponse,
    CreateStockOverviewRequest,
    UpdateStockOverviewRequest,
    StockOverviewQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const stockOverviewKeys = {
    all: ['stock-overview'] as const,
    lists: () => [...stockOverviewKeys.all, 'list'] as const,
    list: (millId: string, params?: StockOverviewQueryParams) =>
        [...stockOverviewKeys.lists(), millId, params] as const,
    details: () => [...stockOverviewKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...stockOverviewKeys.details(), millId, id] as const,
    summaries: () => [...stockOverviewKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<StockOverviewQueryParams, 'startDate' | 'endDate'>
    ) => [...stockOverviewKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch stock overview list with pagination and filters
 */
export const useStockOverviewList = (
    millId: string,
    params?: StockOverviewQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<StockOverviewListResponse, Error>({
        queryKey: stockOverviewKeys.list(millId, params),
        queryFn: () => fetchStockOverviewList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single stock overview entry
 */
export const useStockOverviewDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StockOverviewResponse, Error>({
        queryKey: stockOverviewKeys.detail(millId, id),
        queryFn: () => fetchStockOverviewById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch stock overview summary/statistics
 */
export const useStockOverviewSummary = (
    millId: string,
    params?: Pick<StockOverviewQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<StockOverviewSummaryResponse, Error>({
        queryKey: stockOverviewKeys.summary(millId, params),
        queryFn: () => fetchStockOverviewSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new stock overview entry
 */
export const useCreateStockOverview = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        StockOverviewResponse,
        Error,
        CreateStockOverviewRequest
    >({
        mutationFn: (data) => createStockOverview(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.summaries(),
            })
            toast.success('Stock overview entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create stock overview entry'
            )
        },
    })
}

/**
 * Hook to update an existing stock overview entry
 */
export const useUpdateStockOverview = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        StockOverviewResponse,
        Error,
        UpdateStockOverviewRequest
    >({
        mutationFn: (data) => updateStockOverview(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                stockOverviewKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.summaries(),
            })
            toast.success('Stock overview entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update stock overview entry'
            )
        },
    })
}

/**
 * Hook to delete a stock overview entry
 */
export const useDeleteStockOverview = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteStockOverview(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.summaries(),
            })
            toast.success('Stock overview entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete stock overview entry'
            )
        },
    })
}

/**
 * Hook to bulk delete stock overview entries
 */
export const useBulkDeleteStockOverview = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteStockOverview(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: stockOverviewKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export stock overview entries
 */
export const useExportStockOverview = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: StockOverviewQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportStockOverview(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `stock-overview-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
