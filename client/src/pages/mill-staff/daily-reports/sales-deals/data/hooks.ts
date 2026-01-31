/**
 * Daily Sales Deals Hooks
 * React Query hooks for Daily Sales Deals data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailySalesDealList,
    fetchDailySalesDealById,
    fetchDailySalesDealSummary,
    createDailySalesDeal,
    updateDailySalesDeal,
    deleteDailySalesDeal,
    bulkDeleteDailySalesDeal,
    exportDailySalesDeal,
} from './service'
import type {
    DailySalesDealResponse,
    DailySalesDealListResponse,
    DailySalesDealSummaryResponse,
    CreateDailySalesDealRequest,
    UpdateDailySalesDealRequest,
    DailySalesDealQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailySalesDealKeys = {
    all: ['daily-sales-deal'] as const,
    lists: () => [...dailySalesDealKeys.all, 'list'] as const,
    list: (millId: string, params?: DailySalesDealQueryParams) =>
        [...dailySalesDealKeys.lists(), millId, params] as const,
    details: () => [...dailySalesDealKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailySalesDealKeys.details(), millId, id] as const,
    summaries: () => [...dailySalesDealKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailySalesDealQueryParams, 'startDate' | 'endDate'>
    ) => [...dailySalesDealKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily sales deal list with pagination and filters
 */
export const useDailySalesDealList = (
    millId: string,
    params?: DailySalesDealQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailySalesDealListResponse, Error>({
        queryKey: dailySalesDealKeys.list(millId, params),
        queryFn: () => fetchDailySalesDealList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily sales deal entry
 */
export const useDailySalesDealDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailySalesDealResponse, Error>({
        queryKey: dailySalesDealKeys.detail(millId, id),
        queryFn: () => fetchDailySalesDealById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily sales deal summary/statistics
 */
export const useDailySalesDealSummary = (
    millId: string,
    params?: Pick<DailySalesDealQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailySalesDealSummaryResponse, Error>({
        queryKey: dailySalesDealKeys.summary(millId, params),
        queryFn: () => fetchDailySalesDealSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily sales deal entry
 */
export const useCreateDailySalesDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        DailySalesDealResponse,
        Error,
        CreateDailySalesDealRequest
    >({
        mutationFn: (data) => createDailySalesDeal(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.summaries(),
            })
            toast.success('Daily sales deal created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily sales deal')
        },
    })
}

/**
 * Hook to update an existing daily sales deal entry
 */
export const useUpdateDailySalesDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        DailySalesDealResponse,
        Error,
        UpdateDailySalesDealRequest
    >({
        mutationFn: (data) => updateDailySalesDeal(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailySalesDealKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.summaries(),
            })
            toast.success('Daily sales deal updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily sales deal')
        },
    })
}

/**
 * Hook to delete a daily sales deal entry
 */
export const useDeleteDailySalesDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailySalesDeal(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.summaries(),
            })
            toast.success('Daily sales deal deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily sales deal')
        },
    })
}

/**
 * Hook to bulk delete daily sales deal entries
 */
export const useBulkDeleteDailySalesDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailySalesDeal(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailySalesDealKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily sales deal entries
 */
export const useExportDailySalesDeal = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: DailySalesDealQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportDailySalesDeal(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `daily-sales-deals-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
