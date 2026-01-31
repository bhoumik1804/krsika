/**
 * Khanda Outward Hooks
 * React Query hooks for Khanda Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchKhandaOutwardList,
    fetchKhandaOutwardById,
    fetchKhandaOutwardSummary,
    createKhandaOutward,
    updateKhandaOutward,
    deleteKhandaOutward,
    bulkDeleteKhandaOutward,
    exportKhandaOutward,
} from './service'
import type {
    KhandaOutwardResponse,
    KhandaOutwardListResponse,
    KhandaOutwardSummaryResponse,
    CreateKhandaOutwardRequest,
    UpdateKhandaOutwardRequest,
    KhandaOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const khandaOutwardKeys = {
    all: ['khanda-outward'] as const,
    lists: () => [...khandaOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: KhandaOutwardQueryParams) =>
        [...khandaOutwardKeys.lists(), millId, params] as const,
    details: () => [...khandaOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...khandaOutwardKeys.details(), millId, id] as const,
    summaries: () => [...khandaOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<KhandaOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...khandaOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch khanda outward list with pagination and filters
 */
export const useKhandaOutwardList = (
    millId: string,
    params?: KhandaOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<KhandaOutwardListResponse, Error>({
        queryKey: khandaOutwardKeys.list(millId, params),
        queryFn: () => fetchKhandaOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single khanda outward entry
 */
export const useKhandaOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<KhandaOutwardResponse, Error>({
        queryKey: khandaOutwardKeys.detail(millId, id),
        queryFn: () => fetchKhandaOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch khanda outward summary/statistics
 */
export const useKhandaOutwardSummary = (
    millId: string,
    params?: Pick<KhandaOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<KhandaOutwardSummaryResponse, Error>({
        queryKey: khandaOutwardKeys.summary(millId, params),
        queryFn: () => fetchKhandaOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new khanda outward entry
 */
export const useCreateKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        KhandaOutwardResponse,
        Error,
        CreateKhandaOutwardRequest
    >({
        mutationFn: (data) => createKhandaOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.summaries(),
            })
            toast.success('Khanda outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create khanda outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing khanda outward entry
 */
export const useUpdateKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        KhandaOutwardResponse,
        Error,
        UpdateKhandaOutwardRequest
    >({
        mutationFn: (data) => updateKhandaOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                khandaOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.summaries(),
            })
            toast.success('Khanda outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update khanda outward entry'
            )
        },
    })
}

/**
 * Hook to delete a khanda outward entry
 */
export const useDeleteKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteKhandaOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.summaries(),
            })
            toast.success('Khanda outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete khanda outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete khanda outward entries
 */
export const useBulkDeleteKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteKhandaOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: khandaOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export khanda outward entries
 */
export const useExportKhandaOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: KhandaOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportKhandaOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `khanda-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
