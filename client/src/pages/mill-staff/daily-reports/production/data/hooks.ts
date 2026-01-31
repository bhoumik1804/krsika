/**
 * Daily Production Hooks
 * React Query hooks for Daily Production data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyProductionList,
    fetchDailyProductionById,
    fetchDailyProductionSummary,
    createDailyProduction,
    updateDailyProduction,
    deleteDailyProduction,
    bulkDeleteDailyProduction,
    exportDailyProduction,
} from './service'
import type {
    DailyProductionResponse,
    DailyProductionListResponse,
    DailyProductionSummaryResponse,
    CreateDailyProductionRequest,
    UpdateDailyProductionRequest,
    DailyProductionQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyProductionKeys = {
    all: ['daily-production'] as const,
    lists: () => [...dailyProductionKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyProductionQueryParams) =>
        [...dailyProductionKeys.lists(), millId, params] as const,
    details: () => [...dailyProductionKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyProductionKeys.details(), millId, id] as const,
    summaries: () => [...dailyProductionKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyProductionQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyProductionKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily production list with pagination and filters
 */
export const useDailyProductionList = (
    millId: string,
    params?: DailyProductionQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyProductionListResponse, Error>({
        queryKey: dailyProductionKeys.list(millId, params),
        queryFn: () => fetchDailyProductionList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily production entry
 */
export const useDailyProductionDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyProductionResponse, Error>({
        queryKey: dailyProductionKeys.detail(millId, id),
        queryFn: () => fetchDailyProductionById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily production summary/statistics
 */
export const useDailyProductionSummary = (
    millId: string,
    params?: Pick<DailyProductionQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyProductionSummaryResponse, Error>({
        queryKey: dailyProductionKeys.summary(millId, params),
        queryFn: () => fetchDailyProductionSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily production entry
 */
export const useCreateDailyProduction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        DailyProductionResponse,
        Error,
        CreateDailyProductionRequest
    >({
        mutationFn: (data) => createDailyProduction(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.summaries(),
            })
            toast.success('Daily production entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create daily production entry'
            )
        },
    })
}

/**
 * Hook to update an existing daily production entry
 */
export const useUpdateDailyProduction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        DailyProductionResponse,
        Error,
        UpdateDailyProductionRequest
    >({
        mutationFn: (data) => updateDailyProduction(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyProductionKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.summaries(),
            })
            toast.success('Daily production entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update daily production entry'
            )
        },
    })
}

/**
 * Hook to delete a daily production entry
 */
export const useDeleteDailyProduction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyProduction(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.summaries(),
            })
            toast.success('Daily production entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete daily production entry'
            )
        },
    })
}

/**
 * Hook to bulk delete daily production entries
 */
export const useBulkDeleteDailyProduction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        { deletedCount: number; requestedCount: number },
        Error,
        string[]
    >({
        mutationFn: (ids) => bulkDeleteDailyProduction(millId, ids),
        onSuccess: (result) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyProductionKeys.summaries(),
            })
            toast.success(`${result.deletedCount} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily production entries
 */
export const useExportDailyProduction = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: DailyProductionQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportDailyProduction(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `daily-production-${new Date().toISOString().split('T')[0]}.${format}`
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
