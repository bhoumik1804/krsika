/**
 * Daily Outward Hooks
 * React Query hooks for Daily Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyOutwardList,
    fetchDailyOutwardById,
    fetchDailyOutwardSummary,
    createDailyOutward,
    updateDailyOutward,
    deleteDailyOutward,
    bulkDeleteDailyOutward,
    exportDailyOutward,
} from './service'
import type {
    DailyOutwardResponse,
    DailyOutwardListResponse,
    DailyOutwardSummaryResponse,
    CreateDailyOutwardRequest,
    UpdateDailyOutwardRequest,
    DailyOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyOutwardKeys = {
    all: ['daily-outward'] as const,
    lists: () => [...dailyOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyOutwardQueryParams) =>
        [...dailyOutwardKeys.lists(), millId, params] as const,
    details: () => [...dailyOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyOutwardKeys.details(), millId, id] as const,
    summaries: () => [...dailyOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily outward list with pagination and filters
 */
export const useDailyOutwardList = (
    millId: string,
    params?: DailyOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyOutwardListResponse, Error>({
        queryKey: dailyOutwardKeys.list(millId, params),
        queryFn: () => fetchDailyOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily outward entry
 */
export const useDailyOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyOutwardResponse, Error>({
        queryKey: dailyOutwardKeys.detail(millId, id),
        queryFn: () => fetchDailyOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily outward summary/statistics
 */
export const useDailyOutwardSummary = (
    millId: string,
    params?: Pick<DailyOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyOutwardSummaryResponse, Error>({
        queryKey: dailyOutwardKeys.summary(millId, params),
        queryFn: () => fetchDailyOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily outward entry
 */
export const useCreateDailyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyOutwardResponse, Error, CreateDailyOutwardRequest>({
        mutationFn: (data) => createDailyOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.summaries(),
            })
            toast.success('Daily outward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily outward entry')
        },
    })
}

/**
 * Hook to update an existing daily outward entry
 */
export const useUpdateDailyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyOutwardResponse, Error, UpdateDailyOutwardRequest>({
        mutationFn: (data) => updateDailyOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.summaries(),
            })
            toast.success('Daily outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily outward entry')
        },
    })
}

/**
 * Hook to delete a daily outward entry
 */
export const useDeleteDailyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.summaries(),
            })
            toast.success('Daily outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily outward entry')
        },
    })
}

/**
 * Hook to bulk delete daily outward entries
 */
export const useBulkDeleteDailyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailyOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily outward entries
 */
export const useExportDailyOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: DailyOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportDailyOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `daily-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
