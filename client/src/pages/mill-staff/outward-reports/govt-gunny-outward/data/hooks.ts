/**
 * Govt Gunny Outward Hooks
 * React Query hooks for Govt Gunny Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGovtGunnyOutwardList,
    fetchGovtGunnyOutwardById,
    fetchGovtGunnyOutwardSummary,
    createGovtGunnyOutward,
    updateGovtGunnyOutward,
    deleteGovtGunnyOutward,
    bulkDeleteGovtGunnyOutward,
    exportGovtGunnyOutward,
} from './service'
import type {
    GovtGunnyOutwardResponse,
    GovtGunnyOutwardListResponse,
    GovtGunnyOutwardSummaryResponse,
    CreateGovtGunnyOutwardRequest,
    UpdateGovtGunnyOutwardRequest,
    GovtGunnyOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const govtGunnyOutwardKeys = {
    all: ['govt-gunny-outward'] as const,
    lists: () => [...govtGunnyOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: GovtGunnyOutwardQueryParams) =>
        [...govtGunnyOutwardKeys.lists(), millId, params] as const,
    details: () => [...govtGunnyOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...govtGunnyOutwardKeys.details(), millId, id] as const,
    summaries: () => [...govtGunnyOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<GovtGunnyOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...govtGunnyOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch govt gunny outward list with pagination and filters
 */
export const useGovtGunnyOutwardList = (
    millId: string,
    params?: GovtGunnyOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtGunnyOutwardListResponse, Error>({
        queryKey: govtGunnyOutwardKeys.list(millId, params),
        queryFn: () => fetchGovtGunnyOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single govt gunny outward entry
 */
export const useGovtGunnyOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtGunnyOutwardResponse, Error>({
        queryKey: govtGunnyOutwardKeys.detail(millId, id),
        queryFn: () => fetchGovtGunnyOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch govt gunny outward summary/statistics
 */
export const useGovtGunnyOutwardSummary = (
    millId: string,
    params?: Pick<GovtGunnyOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<GovtGunnyOutwardSummaryResponse, Error>({
        queryKey: govtGunnyOutwardKeys.summary(millId, params),
        queryFn: () => fetchGovtGunnyOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new govt gunny outward entry
 */
export const useCreateGovtGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GovtGunnyOutwardResponse,
        Error,
        CreateGovtGunnyOutwardRequest
    >({
        mutationFn: (data) => createGovtGunnyOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summaries(),
            })
            toast.success('Govt gunny outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create govt gunny outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing govt gunny outward entry
 */
export const useUpdateGovtGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GovtGunnyOutwardResponse,
        Error,
        UpdateGovtGunnyOutwardRequest
    >({
        mutationFn: (data) => updateGovtGunnyOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                govtGunnyOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summaries(),
            })
            toast.success('Govt gunny outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update govt gunny outward entry'
            )
        },
    })
}

/**
 * Hook to delete a govt gunny outward entry
 */
export const useDeleteGovtGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteGovtGunnyOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summaries(),
            })
            toast.success('Govt gunny outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete govt gunny outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete govt gunny outward entries
 */
export const useBulkDeleteGovtGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteGovtGunnyOutward(millId, ids),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summaries(),
            })
            toast.success('Govt gunny outward entries deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete govt gunny outward entries'
            )
        },
    })
}

/**
 * Hook to export govt gunny outward entries
 */
export const useExportGovtGunnyOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: GovtGunnyOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportGovtGunnyOutward(millId, params, format),
        onSuccess: (blob, { format = 'xlsx' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `govt-gunny-outward-export.${format}`
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
