/**
 * Govt Paddy Inward Hooks
 * React Query hooks for Govt Paddy Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGovtPaddyInwardList,
    fetchGovtPaddyInwardById,
    fetchGovtPaddyInwardSummary,
    createGovtPaddyInward,
    updateGovtPaddyInward,
    deleteGovtPaddyInward,
    bulkDeleteGovtPaddyInward,
    exportGovtPaddyInward,
} from './service'
import type {
    GovtPaddyInwardResponse,
    GovtPaddyInwardListResponse,
    GovtPaddyInwardSummaryResponse,
    CreateGovtPaddyInwardRequest,
    UpdateGovtPaddyInwardRequest,
    GovtPaddyInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const govtPaddyInwardKeys = {
    all: ['govt-paddy-inward'] as const,
    lists: () => [...govtPaddyInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: GovtPaddyInwardQueryParams) =>
        [...govtPaddyInwardKeys.lists(), millId, params] as const,
    details: () => [...govtPaddyInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...govtPaddyInwardKeys.details(), millId, id] as const,
    summaries: () => [...govtPaddyInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<GovtPaddyInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...govtPaddyInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch govt paddy inward list with pagination and filters
 */
export const useGovtPaddyInwardList = (
    millId: string,
    params?: GovtPaddyInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtPaddyInwardListResponse, Error>({
        queryKey: govtPaddyInwardKeys.list(millId, params),
        queryFn: () => fetchGovtPaddyInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single govt paddy inward entry
 */
export const useGovtPaddyInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtPaddyInwardResponse, Error>({
        queryKey: govtPaddyInwardKeys.detail(millId, id),
        queryFn: () => fetchGovtPaddyInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch govt paddy inward summary/statistics
 */
export const useGovtPaddyInwardSummary = (
    millId: string,
    params?: Pick<GovtPaddyInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtPaddyInwardSummaryResponse, Error>({
        queryKey: govtPaddyInwardKeys.summary(millId, params),
        queryFn: () => fetchGovtPaddyInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new govt paddy inward entry
 */
export const useCreateGovtPaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GovtPaddyInwardResponse,
        Error,
        CreateGovtPaddyInwardRequest
    >({
        mutationFn: (data) => createGovtPaddyInward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summaries(),
            })
            toast.success('Govt paddy inward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create govt paddy inward entry'
            )
        },
    })
}

/**
 * Hook to update an existing govt paddy inward entry
 */
export const useUpdateGovtPaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GovtPaddyInwardResponse,
        Error,
        UpdateGovtPaddyInwardRequest
    >({
        mutationFn: (data) => updateGovtPaddyInward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                govtPaddyInwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summaries(),
            })
            toast.success('Govt paddy inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update govt paddy inward entry'
            )
        },
    })
}

/**
 * Hook to delete a govt paddy inward entry
 */
export const useDeleteGovtPaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteGovtPaddyInward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summaries(),
            })
            toast.success('Govt paddy inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete govt paddy inward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete govt paddy inward entries
 */
export const useBulkDeleteGovtPaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteGovtPaddyInward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export govt paddy inward entries
 */
export const useExportGovtPaddyInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: GovtPaddyInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportGovtPaddyInward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `govt-paddy-inward-${new Date().toISOString().split('T')[0]}.${format}`
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
