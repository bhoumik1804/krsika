/**
 * FRK Outward Hooks
 * React Query hooks for FRK Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchFrkOutwardList,
    fetchFrkOutwardById,
    fetchFrkOutwardSummary,
    createFrkOutward,
    updateFrkOutward,
    deleteFrkOutward,
    bulkDeleteFrkOutward,
    exportFrkOutward,
} from './service'
import type {
    FrkOutwardResponse,
    FrkOutwardListResponse,
    FrkOutwardSummaryResponse,
    CreateFrkOutwardRequest,
    UpdateFrkOutwardRequest,
    FrkOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const frkOutwardKeys = {
    all: ['frk-outward'] as const,
    lists: () => [...frkOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: FrkOutwardQueryParams) =>
        [...frkOutwardKeys.lists(), millId, params] as const,
    details: () => [...frkOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...frkOutwardKeys.details(), millId, id] as const,
    summaries: () => [...frkOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FrkOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...frkOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch FRK outward list with pagination and filters
 */
export const useFrkOutwardList = (
    millId: string,
    params?: FrkOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkOutwardListResponse, Error>({
        queryKey: frkOutwardKeys.list(millId, params),
        queryFn: () => fetchFrkOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single FRK outward entry
 */
export const useFrkOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkOutwardResponse, Error>({
        queryKey: frkOutwardKeys.detail(millId, id),
        queryFn: () => fetchFrkOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch FRK outward summary/statistics
 */
export const useFrkOutwardSummary = (
    millId: string,
    params?: Pick<FrkOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkOutwardSummaryResponse, Error>({
        queryKey: frkOutwardKeys.summary(millId, params),
        queryFn: () => fetchFrkOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new FRK outward entry
 */
export const useCreateFrkOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateFrkOutwardRequest) =>
            createFrkOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.summaries(),
            })
            toast.success('FRK outward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create FRK outward entry')
        },
    })
}

/**
 * Hook to update an existing FRK outward entry
 */
export const useUpdateFrkOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateFrkOutwardRequest) =>
            updateFrkOutward(millId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.detail(millId, variables.id),
            })
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.summaries(),
            })
            toast.success('FRK outward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update FRK outward entry')
        },
    })
}

/**
 * Hook to delete a FRK outward entry
 */
export const useDeleteFrkOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteFrkOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.summaries(),
            })
            toast.success('FRK outward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete FRK outward entry')
        },
    })
}

/**
 * Hook to bulk delete FRK outward entries
 */
export const useBulkDeleteFrkOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteFrkOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.summaries(),
            })
            toast.success('FRK outward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete FRK outward entries')
        },
    })
}

/**
 * Hook to export FRK outward entries
 */
export const useExportFrkOutward = (millId: string) => {
    return useMutation({
        mutationFn: (params?: FrkOutwardQueryParams) =>
            exportFrkOutward(millId, params),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `frk-outward-export-${new Date().toISOString().split('T')[0]}.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Export completed successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to export FRK outward entries')
        },
    })
}
