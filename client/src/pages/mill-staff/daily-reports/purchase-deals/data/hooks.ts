/**
 * Daily Purchase Deals Hooks
 * React Query hooks for Daily Purchase Deals data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyPurchaseDealList,
    fetchDailyPurchaseDealById,
    fetchDailyPurchaseDealSummary,
    createDailyPurchaseDeal,
    updateDailyPurchaseDeal,
    deleteDailyPurchaseDeal,
    bulkDeleteDailyPurchaseDeal,
    exportDailyPurchaseDeal,
} from './service'
import type {
    DailyPurchaseDealResponse,
    DailyPurchaseDealListResponse,
    DailyPurchaseDealSummaryResponse,
    CreateDailyPurchaseDealRequest,
    UpdateDailyPurchaseDealRequest,
    DailyPurchaseDealQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyPurchaseDealKeys = {
    all: ['daily-purchase-deal'] as const,
    lists: () => [...dailyPurchaseDealKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyPurchaseDealQueryParams) =>
        [...dailyPurchaseDealKeys.lists(), millId, params] as const,
    details: () => [...dailyPurchaseDealKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyPurchaseDealKeys.details(), millId, id] as const,
    summaries: () => [...dailyPurchaseDealKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyPurchaseDealQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyPurchaseDealKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily purchase deal list with pagination and filters
 */
export const useDailyPurchaseDealList = (
    millId: string,
    params?: DailyPurchaseDealQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyPurchaseDealListResponse, Error>({
        queryKey: dailyPurchaseDealKeys.list(millId, params),
        queryFn: () => fetchDailyPurchaseDealList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily purchase deal entry
 */
export const useDailyPurchaseDealDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyPurchaseDealResponse, Error>({
        queryKey: dailyPurchaseDealKeys.detail(millId, id),
        queryFn: () => fetchDailyPurchaseDealById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily purchase deal summary/statistics
 */
export const useDailyPurchaseDealSummary = (
    millId: string,
    params?: Pick<DailyPurchaseDealQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyPurchaseDealSummaryResponse, Error>({
        queryKey: dailyPurchaseDealKeys.summary(millId, params),
        queryFn: () => fetchDailyPurchaseDealSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily purchase deal entry
 */
export const useCreateDailyPurchaseDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        DailyPurchaseDealResponse,
        Error,
        CreateDailyPurchaseDealRequest
    >({
        mutationFn: (data) => createDailyPurchaseDeal(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.summaries(),
            })
            toast.success('Daily purchase deal created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily purchase deal')
        },
    })
}

/**
 * Hook to update an existing daily purchase deal entry
 */
export const useUpdateDailyPurchaseDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        DailyPurchaseDealResponse,
        Error,
        UpdateDailyPurchaseDealRequest
    >({
        mutationFn: (data) => updateDailyPurchaseDeal(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyPurchaseDealKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.summaries(),
            })
            toast.success('Daily purchase deal updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily purchase deal')
        },
    })
}

/**
 * Hook to delete a daily purchase deal entry
 */
export const useDeleteDailyPurchaseDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyPurchaseDeal(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.summaries(),
            })
            toast.success('Daily purchase deal deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily purchase deal')
        },
    })
}

/**
 * Hook to bulk delete daily purchase deal entries
 */
export const useBulkDeleteDailyPurchaseDeal = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailyPurchaseDeal(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyPurchaseDealKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily purchase deal entries
 */
export const useExportDailyPurchaseDeal = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: DailyPurchaseDealQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportDailyPurchaseDeal(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `daily-purchase-deals-${new Date().toISOString().split('T')[0]}.${format}`
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
