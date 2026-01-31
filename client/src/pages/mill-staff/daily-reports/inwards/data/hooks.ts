/**
 * Daily Inward Hooks
 * React Query hooks for Daily Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyInwardList,
    fetchDailyInwardById,
    fetchDailyInwardSummary,
    createDailyInward,
    updateDailyInward,
    deleteDailyInward,
    bulkDeleteDailyInward,
    exportDailyInward,
} from './service'
import type {
    DailyInwardResponse,
    DailyInwardListResponse,
    DailyInwardSummaryResponse,
    CreateDailyInwardRequest,
    UpdateDailyInwardRequest,
    DailyInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyInwardKeys = {
    all: ['daily-inward'] as const,
    lists: () => [...dailyInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyInwardQueryParams) =>
        [...dailyInwardKeys.lists(), millId, params] as const,
    details: () => [...dailyInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyInwardKeys.details(), millId, id] as const,
    summaries: () => [...dailyInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily inward list with pagination and filters
 */
export const useDailyInwardList = (
    millId: string,
    params?: DailyInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyInwardListResponse, Error>({
        queryKey: dailyInwardKeys.list(millId, params),
        queryFn: () => fetchDailyInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily inward entry
 */
export const useDailyInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyInwardResponse, Error>({
        queryKey: dailyInwardKeys.detail(millId, id),
        queryFn: () => fetchDailyInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily inward summary/statistics
 */
export const useDailyInwardSummary = (
    millId: string,
    params?: Pick<DailyInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyInwardSummaryResponse, Error>({
        queryKey: dailyInwardKeys.summary(millId, params),
        queryFn: () => fetchDailyInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily inward entry
 */
export const useCreateDailyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyInwardResponse, Error, CreateDailyInwardRequest>({
        mutationFn: (data) => createDailyInward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.summaries(),
            })
            toast.success('Daily inward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily inward entry')
        },
    })
}

/**
 * Hook to update an existing daily inward entry
 */
export const useUpdateDailyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyInwardResponse, Error, UpdateDailyInwardRequest>({
        mutationFn: (data) => updateDailyInward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyInwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.summaries(),
            })
            toast.success('Daily inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily inward entry')
        },
    })
}

/**
 * Hook to delete a daily inward entry
 */
export const useDeleteDailyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyInward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.summaries(),
            })
            toast.success('Daily inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily inward entry')
        },
    })
}

/**
 * Hook to bulk delete daily inward entries
 */
export const useBulkDeleteDailyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailyInward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily inward entries
 */
export const useExportDailyInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: DailyInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportDailyInward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `daily-inward-${new Date().toISOString().split('T')[0]}.${format}`
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
