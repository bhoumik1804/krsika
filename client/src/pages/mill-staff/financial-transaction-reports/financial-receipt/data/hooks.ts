/**
 * Financial Receipt Hooks
 * React Query hooks for Financial Receipt data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchFinancialReceiptList,
    fetchFinancialReceiptById,
    fetchFinancialReceiptSummary,
    createFinancialReceipt,
    updateFinancialReceipt,
    deleteFinancialReceipt,
    bulkDeleteFinancialReceipt,
    exportFinancialReceipt,
} from './service'
import type {
    FinancialReceiptResponse,
    FinancialReceiptListResponse,
    FinancialReceiptSummaryResponse,
    CreateFinancialReceiptRequest,
    UpdateFinancialReceiptRequest,
    FinancialReceiptQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const financialReceiptKeys = {
    all: ['financial-receipt'] as const,
    lists: () => [...financialReceiptKeys.all, 'list'] as const,
    list: (millId: string, params?: FinancialReceiptQueryParams) =>
        [...financialReceiptKeys.lists(), millId, params] as const,
    details: () => [...financialReceiptKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...financialReceiptKeys.details(), millId, id] as const,
    summaries: () => [...financialReceiptKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FinancialReceiptQueryParams, 'startDate' | 'endDate'>
    ) => [...financialReceiptKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch financial receipt list with pagination and filters
 */
export const useFinancialReceiptList = (
    millId: string,
    params?: FinancialReceiptQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<FinancialReceiptListResponse, Error>({
        queryKey: financialReceiptKeys.list(millId, params),
        queryFn: () => fetchFinancialReceiptList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single financial receipt entry
 */
export const useFinancialReceiptDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<FinancialReceiptResponse, Error>({
        queryKey: financialReceiptKeys.detail(millId, id),
        queryFn: () => fetchFinancialReceiptById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch financial receipt summary/statistics
 */
export const useFinancialReceiptSummary = (
    millId: string,
    params?: Pick<FinancialReceiptQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<FinancialReceiptSummaryResponse, Error>({
        queryKey: financialReceiptKeys.summary(millId, params),
        queryFn: () => fetchFinancialReceiptSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new financial receipt entry
 */
export const useCreateFinancialReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        FinancialReceiptResponse,
        Error,
        CreateFinancialReceiptRequest
    >({
        mutationFn: (data) => createFinancialReceipt(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Financial receipt entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create financial receipt entry'
            )
        },
    })
}

/**
 * Hook to update an existing financial receipt entry
 */
export const useUpdateFinancialReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        FinancialReceiptResponse,
        Error,
        UpdateFinancialReceiptRequest
    >({
        mutationFn: (data) => updateFinancialReceipt(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                financialReceiptKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Financial receipt entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update financial receipt entry'
            )
        },
    })
}

/**
 * Hook to delete a financial receipt entry
 */
export const useDeleteFinancialReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteFinancialReceipt(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success('Financial receipt entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete financial receipt entry'
            )
        },
    })
}

/**
 * Hook to bulk delete financial receipt entries
 */
export const useBulkDeleteFinancialReceipt = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteFinancialReceipt(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: financialReceiptKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export financial receipt entries
 */
export const useExportFinancialReceipt = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: FinancialReceiptQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportFinancialReceipt(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `financial-receipt-${new Date().toISOString().split('T')[0]}.${format}`
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
