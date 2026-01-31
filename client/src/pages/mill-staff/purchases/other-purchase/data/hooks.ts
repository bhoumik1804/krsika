/**
 * Other Purchase Hooks
 * React Query hooks for Other Purchase data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOtherPurchaseList,
    fetchOtherPurchaseById,
    fetchOtherPurchaseSummary,
    createOtherPurchase,
    updateOtherPurchase,
    deleteOtherPurchase,
    bulkDeleteOtherPurchase,
    exportOtherPurchase,
} from './service'
import type {
    OtherPurchaseResponse,
    OtherPurchaseListResponse,
    OtherPurchaseSummaryResponse,
    CreateOtherPurchaseRequest,
    UpdateOtherPurchaseRequest,
    OtherPurchaseQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const otherPurchaseKeys = {
    all: ['other-purchase'] as const,
    lists: () => [...otherPurchaseKeys.all, 'list'] as const,
    list: (millId: string, params?: OtherPurchaseQueryParams) =>
        [...otherPurchaseKeys.lists(), millId, params] as const,
    details: () => [...otherPurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...otherPurchaseKeys.details(), millId, id] as const,
    summaries: () => [...otherPurchaseKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<OtherPurchaseQueryParams, 'startDate' | 'endDate'>
    ) => [...otherPurchaseKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch other purchase list with pagination and filters
 */
export const useOtherPurchaseList = (
    millId: string,
    params?: OtherPurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherPurchaseListResponse, Error>({
        queryKey: otherPurchaseKeys.list(millId, params),
        queryFn: () => fetchOtherPurchaseList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single other purchase entry
 */
export const useOtherPurchaseDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherPurchaseResponse, Error>({
        queryKey: otherPurchaseKeys.detail(millId, id),
        queryFn: () => fetchOtherPurchaseById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch other purchase summary/statistics
 */
export const useOtherPurchaseSummary = (
    millId: string,
    params?: Pick<OtherPurchaseQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherPurchaseSummaryResponse, Error>({
        queryKey: otherPurchaseKeys.summary(millId, params),
        queryFn: () => fetchOtherPurchaseSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new other purchase entry
 */
export const useCreateOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        OtherPurchaseResponse,
        Error,
        CreateOtherPurchaseRequest
    >({
        mutationFn: (data) => createOtherPurchase(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.summaries(),
            })
            toast.success('Other purchase entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create other purchase entry'
            )
        },
    })
}

/**
 * Hook to update an existing other purchase entry
 */
export const useUpdateOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        OtherPurchaseResponse,
        Error,
        UpdateOtherPurchaseRequest
    >({
        mutationFn: (data) => updateOtherPurchase(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.lists(),
            })
            queryClient.setQueryData(
                otherPurchaseKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.summaries(),
            })
            toast.success('Other purchase entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update other purchase entry'
            )
        },
    })
}

/**
 * Hook to delete a other purchase entry
 */
export const useDeleteOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteOtherPurchase(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.summaries(),
            })
            toast.success('Other purchase entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete other purchase entry'
            )
        },
    })
}

/**
 * Hook to bulk delete other purchase entries
 */
export const useBulkDeleteOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteOtherPurchase(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherPurchaseKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete other purchase entries'
            )
        },
    })
}

/**
 * Hook to export other purchase entries
 */
export const useExportOtherPurchase = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: OtherPurchaseQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportOtherPurchase(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
