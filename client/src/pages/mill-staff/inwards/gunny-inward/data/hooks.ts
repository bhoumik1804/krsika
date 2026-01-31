/**
 * Gunny Inward Hooks
 * React Query hooks for Gunny Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGunnyInwardList,
    fetchGunnyInwardById,
    fetchGunnyInwardSummary,
    createGunnyInward,
    updateGunnyInward,
    deleteGunnyInward,
    bulkDeleteGunnyInward,
    exportGunnyInward,
} from './service'
import type {
    GunnyInwardResponse,
    GunnyInwardListResponse,
    GunnyInwardSummaryResponse,
    CreateGunnyInwardRequest,
    UpdateGunnyInwardRequest,
    GunnyInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const gunnyInwardKeys = {
    all: ['gunny-inward'] as const,
    lists: () => [...gunnyInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: GunnyInwardQueryParams) =>
        [...gunnyInwardKeys.lists(), millId, params] as const,
    details: () => [...gunnyInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...gunnyInwardKeys.details(), millId, id] as const,
    summaries: () => [...gunnyInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<GunnyInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...gunnyInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch gunny inward list with pagination and filters
 */
export const useGunnyInwardList = (
    millId: string,
    params?: GunnyInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyInwardListResponse, Error>({
        queryKey: gunnyInwardKeys.list(millId, params),
        queryFn: () => fetchGunnyInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single gunny inward entry
 */
export const useGunnyInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyInwardResponse, Error>({
        queryKey: gunnyInwardKeys.detail(millId, id),
        queryFn: () => fetchGunnyInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch gunny inward summary/statistics
 */
export const useGunnyInwardSummary = (
    millId: string,
    params?: Pick<GunnyInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyInwardSummaryResponse, Error>({
        queryKey: gunnyInwardKeys.summary(millId, params),
        queryFn: () => fetchGunnyInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new gunny inward entry
 */
export const useCreateGunnyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<GunnyInwardResponse, Error, CreateGunnyInwardRequest>({
        mutationFn: (data) => createGunnyInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summaries(),
            })
            toast.success('Gunny inward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create gunny inward entry')
        },
    })
}

/**
 * Hook to update an existing gunny inward entry
 */
export const useUpdateGunnyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<GunnyInwardResponse, Error, UpdateGunnyInwardRequest>({
        mutationFn: (data) => updateGunnyInward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(),
            })
            queryClient.setQueryData(
                gunnyInwardKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summaries(),
            })
            toast.success('Gunny inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update gunny inward entry')
        },
    })
}

/**
 * Hook to delete a gunny inward entry
 */
export const useDeleteGunnyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteGunnyInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summaries(),
            })
            toast.success('Gunny inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete gunny inward entry')
        },
    })
}

/**
 * Hook to bulk delete gunny inward entries
 */
export const useBulkDeleteGunnyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteGunnyInward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete gunny inward entries'
            )
        },
    })
}

/**
 * Hook to export gunny inward entries
 */
export const useExportGunnyInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: GunnyInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportGunnyInward(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
