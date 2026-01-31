/**
 * Daily Milling Hooks
 * React Query hooks for Daily Milling data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyMillingList,
    fetchDailyMillingById,
    fetchDailyMillingSummary,
    createDailyMilling,
    updateDailyMilling,
    deleteDailyMilling,
    bulkDeleteDailyMilling,
    exportDailyMilling,
} from './service'
import type {
    DailyMillingResponse,
    DailyMillingListResponse,
    DailyMillingSummaryResponse,
    CreateDailyMillingRequest,
    UpdateDailyMillingRequest,
    DailyMillingQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyMillingKeys = {
    all: ['daily-milling'] as const,
    lists: () => [...dailyMillingKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyMillingQueryParams) =>
        [...dailyMillingKeys.lists(), millId, params] as const,
    details: () => [...dailyMillingKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyMillingKeys.details(), millId, id] as const,
    summaries: () => [...dailyMillingKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyMillingQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyMillingKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily milling list with pagination and filters
 */
export const useDailyMillingList = (
    millId: string,
    params?: DailyMillingQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyMillingListResponse, Error>({
        queryKey: dailyMillingKeys.list(millId, params),
        queryFn: () => fetchDailyMillingList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily milling entry
 */
export const useDailyMillingDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyMillingResponse, Error>({
        queryKey: dailyMillingKeys.detail(millId, id),
        queryFn: () => fetchDailyMillingById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily milling summary/statistics
 */
export const useDailyMillingSummary = (
    millId: string,
    params?: Pick<DailyMillingQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyMillingSummaryResponse, Error>({
        queryKey: dailyMillingKeys.summary(millId, params),
        queryFn: () => fetchDailyMillingSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily milling entry
 */
export const useCreateDailyMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyMillingResponse, Error, CreateDailyMillingRequest>({
        mutationFn: (data) => createDailyMilling(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.summaries(),
            })
            toast.success('Daily milling entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily milling entry')
        },
    })
}

/**
 * Hook to update an existing daily milling entry
 */
export const useUpdateDailyMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyMillingResponse, Error, UpdateDailyMillingRequest>({
        mutationFn: (data) => updateDailyMilling(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyMillingKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.summaries(),
            })
            toast.success('Daily milling entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily milling entry')
        },
    })
}

/**
 * Hook to delete a daily milling entry
 */
export const useDeleteDailyMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyMilling(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.summaries(),
            })
            toast.success('Daily milling entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily milling entry')
        },
    })
}

/**
 * Hook to bulk delete daily milling entries
 */
export const useBulkDeleteDailyMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailyMilling(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyMillingKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete daily milling entries'
            )
        },
    })
}

/**
 * Hook to export daily milling entries
 */
export const useExportDailyMilling = (millId: string) => {
    return useMutation<Blob, Error, DailyMillingQueryParams | undefined>({
        mutationFn: (params) => exportDailyMilling(millId, params),
        onSuccess: (blob) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `daily-milling-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export daily milling data')
        },
    })
}
