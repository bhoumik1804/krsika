/**
 * Daily Payment Hooks
 * React Query hooks for Daily Payment data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchDailyPaymentList,
    fetchDailyPaymentById,
    fetchDailyPaymentSummary,
    createDailyPayment,
    updateDailyPayment,
    deleteDailyPayment,
    bulkDeleteDailyPayment,
    exportDailyPayment,
} from './service'
import type {
    DailyPaymentResponse,
    DailyPaymentListResponse,
    DailyPaymentSummaryResponse,
    CreateDailyPaymentRequest,
    UpdateDailyPaymentRequest,
    DailyPaymentQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const dailyPaymentKeys = {
    all: ['daily-payment'] as const,
    lists: () => [...dailyPaymentKeys.all, 'list'] as const,
    list: (millId: string, params?: DailyPaymentQueryParams) =>
        [...dailyPaymentKeys.lists(), millId, params] as const,
    details: () => [...dailyPaymentKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...dailyPaymentKeys.details(), millId, id] as const,
    summaries: () => [...dailyPaymentKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<DailyPaymentQueryParams, 'startDate' | 'endDate'>
    ) => [...dailyPaymentKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch daily payment list with pagination and filters
 */
export const useDailyPaymentList = (
    millId: string,
    params?: DailyPaymentQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyPaymentListResponse, Error>({
        queryKey: dailyPaymentKeys.list(millId, params),
        queryFn: () => fetchDailyPaymentList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single daily payment entry
 */
export const useDailyPaymentDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyPaymentResponse, Error>({
        queryKey: dailyPaymentKeys.detail(millId, id),
        queryFn: () => fetchDailyPaymentById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch daily payment summary/statistics
 */
export const useDailyPaymentSummary = (
    millId: string,
    params?: Pick<DailyPaymentQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<DailyPaymentSummaryResponse, Error>({
        queryKey: dailyPaymentKeys.summary(millId, params),
        queryFn: () => fetchDailyPaymentSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new daily payment entry
 */
export const useCreateDailyPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyPaymentResponse, Error, CreateDailyPaymentRequest>({
        mutationFn: (data) => createDailyPayment(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.summaries(),
            })
            toast.success('Daily payment entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create daily payment entry')
        },
    })
}

/**
 * Hook to update an existing daily payment entry
 */
export const useUpdateDailyPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<DailyPaymentResponse, Error, UpdateDailyPaymentRequest>({
        mutationFn: (data) => updateDailyPayment(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                dailyPaymentKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.summaries(),
            })
            toast.success('Daily payment entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update daily payment entry')
        },
    })
}

/**
 * Hook to delete a daily payment entry
 */
export const useDeleteDailyPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteDailyPayment(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.summaries(),
            })
            toast.success('Daily payment entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete daily payment entry')
        },
    })
}

/**
 * Hook to bulk delete daily payment entries
 */
export const useBulkDeleteDailyPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteDailyPayment(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: dailyPaymentKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export daily payment entries
 */
export const useExportDailyPayment = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: DailyPaymentQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportDailyPayment(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `daily-payment-${new Date().toISOString().split('T')[0]}.${format}`
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
