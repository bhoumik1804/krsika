/**
 * FRK Inward Hooks
 * React Query hooks for FRK Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchFrkInwardList,
    fetchFrkInwardById,
    fetchFrkInwardSummary,
    createFrkInward,
    updateFrkInward,
    deleteFrkInward,
    bulkDeleteFrkInward,
    exportFrkInward,
} from './service'
import type {
    FrkInwardResponse,
    FrkInwardListResponse,
    FrkInwardSummaryResponse,
    CreateFrkInwardRequest,
    UpdateFrkInwardRequest,
    FrkInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const frkInwardKeys = {
    all: ['frk-inward'] as const,
    lists: () => [...frkInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: FrkInwardQueryParams) =>
        [...frkInwardKeys.lists(), millId, params] as const,
    details: () => [...frkInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...frkInwardKeys.details(), millId, id] as const,
    summaries: () => [...frkInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FrkInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...frkInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch FRK inward list with pagination and filters
 */
export const useFrkInwardList = (
    millId: string,
    params?: FrkInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkInwardListResponse, Error>({
        queryKey: frkInwardKeys.list(millId, params),
        queryFn: () => fetchFrkInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single FRK inward entry
 */
export const useFrkInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkInwardResponse, Error>({
        queryKey: frkInwardKeys.detail(millId, id),
        queryFn: () => fetchFrkInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch FRK inward summary/statistics
 */
export const useFrkInwardSummary = (
    millId: string,
    params?: Pick<FrkInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkInwardSummaryResponse, Error>({
        queryKey: frkInwardKeys.summary(millId, params),
        queryFn: () => fetchFrkInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new FRK inward entry
 */
export const useCreateFrkInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<FrkInwardResponse, Error, CreateFrkInwardRequest>({
        mutationFn: (data) => createFrkInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summaries(),
            })
            toast.success('FRK inward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create FRK inward entry')
        },
    })
}

/**
 * Hook to update an existing FRK inward entry
 */
export const useUpdateFrkInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<FrkInwardResponse, Error, UpdateFrkInwardRequest>({
        mutationFn: (data) => updateFrkInward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(),
            })
            queryClient.setQueryData(
                frkInwardKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summaries(),
            })
            toast.success('FRK inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update FRK inward entry')
        },
    })
}

/**
 * Hook to delete a FRK inward entry
 */
export const useDeleteFrkInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteFrkInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summaries(),
            })
            toast.success('FRK inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete FRK inward entry')
        },
    })
}

/**
 * Hook to bulk delete FRK inward entries
 */
export const useBulkDeleteFrkInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteFrkInward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete FRK inward entries')
        },
    })
}

/**
 * Hook to export FRK inward entries
 */
export const useExportFrkInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: FrkInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportFrkInward(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
