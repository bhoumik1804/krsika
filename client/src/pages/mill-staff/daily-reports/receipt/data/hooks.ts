/**
 * Daily Receipt Hooks
 * React Query hooks for Daily Receipt data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyReceiptList,
    fetchDailyReceiptById,
    fetchDailyReceiptSummary,
    createDailyReceipt,
    updateDailyReceipt,
    deleteDailyReceipt,
    bulkDeleteDailyReceipt,
    exportDailyReceipt,
} from './service'
import type {
    DailyReceiptResponse,
    DailyReceiptListResponse,
    DailyReceiptSummaryResponse,
    CreateDailyReceiptRequest,
    UpdateDailyReceiptRequest,
    DailyReceiptQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyReceiptKeys = {
    all: ['daily-receipt'] as const,
    lists: () => [...dailyReceiptKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyReceiptQueryParams) =>
        [...dailyReceiptKeys.lists(), millId, params] as const,
    details: () => [...dailyReceiptKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyReceiptKeys.details(), millId, id] as const,
    summaries: () => [...dailyReceiptKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyReceiptQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyReceiptKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily receipt list with pagination and filters
 */
export const useDailyReceiptList = (
    millId: string,
    params?: DailyReceiptQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyReceiptListResponse, Error>({
        queryKey: dailyReceiptKeys.list(millId, params),
        queryFn: () => fetchDailyReceiptList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily receipt entry
 */
export const useDailyReceiptDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyReceiptResponse, Error>({
        queryKey: dailyReceiptKeys.detail(millId, id),
        queryFn: () => fetchDailyReceiptById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily receipt summary/statistics
 */
export const useDailyReceiptSummary = (
    millId: string,
    params?: Pick<DailyReceiptQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyReceiptSummaryResponse, Error>({
        queryKey: dailyReceiptKeys.summary(millId, params),
        queryFn: () => fetchDailyReceiptSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily receipt entry
 */
export const useCreateDailyReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyReceiptResponse, Error, CreateDailyReceiptRequest>({
        mutationFn: (data) => createDailyReceipt(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.summaries(),
            })
            toast.success('Daily receipt entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily receipt entry')
        },
    })
}

/**
 * Hook to update an existing daily receipt entry
 */
export const useUpdateDailyReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyReceiptResponse, Error, UpdateDailyReceiptRequest>({
        mutationFn: (data) => updateDailyReceipt(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyReceiptKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.summaries(),
            })
            toast.success('Daily receipt entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily receipt entry')
        },
    })
}

/**
 * Hook to delete a daily receipt entry
 */
export const useDeleteDailyReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyReceipt(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.summaries(),
            })
            toast.success('Daily receipt entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily receipt entry')
        },
    })
}

/**
 * Hook to bulk delete daily receipt entries
 */
export const useBulkDeleteDailyReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailyReceipt(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyReceiptKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily receipt entries
 */
export const useExportDailyReceipt = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: DailyReceiptQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportDailyReceipt(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `daily-receipt-${new Date().toISOString().split('T')[0]}.${format}`
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
