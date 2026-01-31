/**
 * Financial Payment Hooks
 * React Query hooks for Financial Payment data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchFinancialPaymentList,
    fetchFinancialPaymentById,
    fetchFinancialPaymentSummary,
    createFinancialPayment,
    updateFinancialPayment,
    deleteFinancialPayment,
    bulkDeleteFinancialPayment,
    exportFinancialPayment,
} from './service'
import type {
    FinancialPaymentResponse,
    FinancialPaymentListResponse,
    FinancialPaymentSummaryResponse,
    CreateFinancialPaymentRequest,
    UpdateFinancialPaymentRequest,
    FinancialPaymentQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const financialPaymentKeys = {
    all: ['financial-payment'] as const,
    lists: () => [...financialPaymentKeys.all, 'list'] as const,
    list: (millId: string, params?: FinancialPaymentQueryParams) =>
        [...financialPaymentKeys.lists(), millId, params] as const,
    details: () => [...financialPaymentKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...financialPaymentKeys.details(), millId, id] as const,
    summaries: () => [...financialPaymentKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FinancialPaymentQueryParams, 'startDate' | 'endDate'>
    ) => [...financialPaymentKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch financial payment list with pagination and filters
 */
export const useFinancialPaymentList = (
    millId: string,
    params?: FinancialPaymentQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<FinancialPaymentListResponse, Error>({
        queryKey: financialPaymentKeys.list(millId, params),
        queryFn: () => fetchFinancialPaymentList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single financial payment entry
 */
export const useFinancialPaymentDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<FinancialPaymentResponse, Error>({
        queryKey: financialPaymentKeys.detail(millId, id),
        queryFn: () => fetchFinancialPaymentById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch financial payment summary/statistics
 */
export const useFinancialPaymentSummary = (
    millId: string,
    params?: Pick<FinancialPaymentQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<FinancialPaymentSummaryResponse, Error>({
        queryKey: financialPaymentKeys.summary(millId, params),
        queryFn: () => fetchFinancialPaymentSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new financial payment entry
 */
export const useCreateFinancialPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        FinancialPaymentResponse,
        Error,
        CreateFinancialPaymentRequest
    >({
        mutationFn: (data) => createFinancialPayment(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Financial payment entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create financial payment entry'
            )
        },
    })
}

/**
 * Hook to update an existing financial payment entry
 */
export const useUpdateFinancialPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        FinancialPaymentResponse,
        Error,
        UpdateFinancialPaymentRequest
    >({
        mutationFn: (data) => updateFinancialPayment(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                financialPaymentKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Financial payment entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update financial payment entry'
            )
        },
    })
}

/**
 * Hook to delete a financial payment entry
 */
export const useDeleteFinancialPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteFinancialPayment(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success('Financial payment entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete financial payment entry'
            )
        },
    })
}

/**
 * Hook to bulk delete financial payment entries
 */
export const useBulkDeleteFinancialPayment = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteFinancialPayment(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: financialPaymentKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export financial payment entries
 */
export const useExportFinancialPayment = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: FinancialPaymentQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportFinancialPayment(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `financial-payment-${new Date().toISOString().split('T')[0]}.${format}`
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
