/**
 * Kodha Outward Hooks
 * React Query hooks for Kodha Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchKodhaOutwardList,
    fetchKodhaOutwardById,
    fetchKodhaOutwardSummary,
    createKodhaOutward,
    updateKodhaOutward,
    deleteKodhaOutward,
    bulkDeleteKodhaOutward,
    exportKodhaOutward,
} from './service'
import type {
    KodhaOutwardResponse,
    KodhaOutwardListResponse,
    KodhaOutwardSummaryResponse,
    CreateKodhaOutwardRequest,
    UpdateKodhaOutwardRequest,
    KodhaOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const kodhaOutwardKeys = {
    all: ['kodha-outward'] as const,
    lists: () => [...kodhaOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: KodhaOutwardQueryParams) =>
        [...kodhaOutwardKeys.lists(), millId, params] as const,
    details: () => [...kodhaOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...kodhaOutwardKeys.details(), millId, id] as const,
    summaries: () => [...kodhaOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<KodhaOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...kodhaOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch kodha outward list with pagination and filters
 */
export const useKodhaOutwardList = (
    millId: string,
    params?: KodhaOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<KodhaOutwardListResponse, Error>({
        queryKey: kodhaOutwardKeys.list(millId, params),
        queryFn: () => fetchKodhaOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single kodha outward entry
 */
export const useKodhaOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<KodhaOutwardResponse, Error>({
        queryKey: kodhaOutwardKeys.detail(millId, id),
        queryFn: () => fetchKodhaOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch kodha outward summary/statistics
 */
export const useKodhaOutwardSummary = (
    millId: string,
    params?: Pick<KodhaOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<KodhaOutwardSummaryResponse, Error>({
        queryKey: kodhaOutwardKeys.summary(millId, params),
        queryFn: () => fetchKodhaOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new kodha outward entry
 */
export const useCreateKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<KodhaOutwardResponse, Error, CreateKodhaOutwardRequest>({
        mutationFn: (data) => createKodhaOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summaries(),
            })
            toast.success('Kodha outward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create kodha outward entry')
        },
    })
}

/**
 * Hook to update an existing kodha outward entry
 */
export const useUpdateKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<KodhaOutwardResponse, Error, UpdateKodhaOutwardRequest>({
        mutationFn: (data) => updateKodhaOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                kodhaOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summaries(),
            })
            toast.success('Kodha outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update kodha outward entry')
        },
    })
}

/**
 * Hook to delete a kodha outward entry
 */
export const useDeleteKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteKodhaOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summaries(),
            })
            toast.success('Kodha outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete kodha outward entry')
        },
    })
}

/**
 * Hook to bulk delete kodha outward entries
 */
export const useBulkDeleteKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteKodhaOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export kodha outward entries
 */
export const useExportKodhaOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: KodhaOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportKodhaOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `kodha-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
