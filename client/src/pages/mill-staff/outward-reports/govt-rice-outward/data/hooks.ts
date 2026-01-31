/**
 * Govt Rice Outward Hooks
 * React Query hooks for Govt Rice Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGovtRiceOutwardList,
    fetchGovtRiceOutwardById,
    fetchGovtRiceOutwardSummary,
    createGovtRiceOutward,
    updateGovtRiceOutward,
    deleteGovtRiceOutward,
    bulkDeleteGovtRiceOutward,
    exportGovtRiceOutward,
} from './service'
import type {
    GovtRiceOutwardResponse,
    GovtRiceOutwardListResponse,
    GovtRiceOutwardSummaryResponse,
    CreateGovtRiceOutwardRequest,
    UpdateGovtRiceOutwardRequest,
    GovtRiceOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const govtRiceOutwardKeys = {
    all: ['govt-rice-outward'] as const,
    lists: () => [...govtRiceOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: GovtRiceOutwardQueryParams) =>
        [...govtRiceOutwardKeys.lists(), millId, params] as const,
    details: () => [...govtRiceOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...govtRiceOutwardKeys.details(), millId, id] as const,
    summaries: () => [...govtRiceOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<GovtRiceOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...govtRiceOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch govt rice outward list with pagination and filters
 */
export const useGovtRiceOutwardList = (
    millId: string,
    params?: GovtRiceOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtRiceOutwardListResponse, Error>({
        queryKey: govtRiceOutwardKeys.list(millId, params),
        queryFn: () => fetchGovtRiceOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single govt rice outward entry
 */
export const useGovtRiceOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtRiceOutwardResponse, Error>({
        queryKey: govtRiceOutwardKeys.detail(millId, id),
        queryFn: () => fetchGovtRiceOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch govt rice outward summary/statistics
 */
export const useGovtRiceOutwardSummary = (
    millId: string,
    params?: Pick<GovtRiceOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtRiceOutwardSummaryResponse, Error>({
        queryKey: govtRiceOutwardKeys.summary(millId, params),
        queryFn: () => fetchGovtRiceOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new govt rice outward entry
 */
export const useCreateGovtRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GovtRiceOutwardResponse,
        Error,
        CreateGovtRiceOutwardRequest
    >({
        mutationFn: (data) => createGovtRiceOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summaries(),
            })
            toast.success('Govt rice outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create govt rice outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing govt rice outward entry
 */
export const useUpdateGovtRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GovtRiceOutwardResponse,
        Error,
        UpdateGovtRiceOutwardRequest
    >({
        mutationFn: (data) => updateGovtRiceOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                govtRiceOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summaries(),
            })
            toast.success('Govt rice outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update govt rice outward entry'
            )
        },
    })
}

/**
 * Hook to delete a govt rice outward entry
 */
export const useDeleteGovtRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteGovtRiceOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summaries(),
            })
            toast.success('Govt rice outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete govt rice outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete govt rice outward entries
 */
export const useBulkDeleteGovtRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteGovtRiceOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export govt rice outward entries
 */
export const useExportGovtRiceOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: GovtRiceOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportGovtRiceOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `govt-rice-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
