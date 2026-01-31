/**
 * Silky Kodha Outward Hooks
 * React Query hooks for Silky Kodha Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchSilkyKodhaOutwardList,
    fetchSilkyKodhaOutwardById,
    fetchSilkyKodhaOutwardSummary,
    createSilkyKodhaOutward,
    updateSilkyKodhaOutward,
    deleteSilkyKodhaOutward,
    bulkDeleteSilkyKodhaOutward,
    exportSilkyKodhaOutward,
} from './service'
import type {
    SilkyKodhaOutwardResponse,
    SilkyKodhaOutwardListResponse,
    SilkyKodhaOutwardSummaryResponse,
    CreateSilkyKodhaOutwardRequest,
    UpdateSilkyKodhaOutwardRequest,
    SilkyKodhaOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const silkyKodhaOutwardKeys = {
    all: ['silky-kodha-outward'] as const,
    lists: () => [...silkyKodhaOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: SilkyKodhaOutwardQueryParams) =>
        [...silkyKodhaOutwardKeys.lists(), millId, params] as const,
    details: () => [...silkyKodhaOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...silkyKodhaOutwardKeys.details(), millId, id] as const,
    summaries: () => [...silkyKodhaOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<SilkyKodhaOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...silkyKodhaOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch silky kodha outward list with pagination and filters
 */
export const useSilkyKodhaOutwardList = (
    millId: string,
    params?: SilkyKodhaOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<SilkyKodhaOutwardListResponse, Error>({
        queryKey: silkyKodhaOutwardKeys.list(millId, params),
        queryFn: () => fetchSilkyKodhaOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single silky kodha outward entry
 */
export const useSilkyKodhaOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<SilkyKodhaOutwardResponse, Error>({
        queryKey: silkyKodhaOutwardKeys.detail(millId, id),
        queryFn: () => fetchSilkyKodhaOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch silky kodha outward summary/statistics
 */
export const useSilkyKodhaOutwardSummary = (
    millId: string,
    params?: Pick<SilkyKodhaOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<SilkyKodhaOutwardSummaryResponse, Error>({
        queryKey: silkyKodhaOutwardKeys.summary(millId, params),
        queryFn: () => fetchSilkyKodhaOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new silky kodha outward entry
 */
export const useCreateSilkyKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        SilkyKodhaOutwardResponse,
        Error,
        CreateSilkyKodhaOutwardRequest
    >({
        mutationFn: (data) => createSilkyKodhaOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summaries(),
            })
            toast.success('Silky Kodha outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create Silky Kodha outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing silky kodha outward entry
 */
export const useUpdateSilkyKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        SilkyKodhaOutwardResponse,
        Error,
        UpdateSilkyKodhaOutwardRequest
    >({
        mutationFn: (data) => updateSilkyKodhaOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                silkyKodhaOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summaries(),
            })
            toast.success('Silky Kodha outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update Silky Kodha outward entry'
            )
        },
    })
}

/**
 * Hook to delete a silky kodha outward entry
 */
export const useDeleteSilkyKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteSilkyKodhaOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summaries(),
            })
            toast.success('Silky Kodha outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete Silky Kodha outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete silky kodha outward entries
 */
export const useBulkDeleteSilkyKodhaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteSilkyKodhaOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export silky kodha outward entries
 */
export const useExportSilkyKodhaOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: SilkyKodhaOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportSilkyKodhaOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `silky-kodha-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
