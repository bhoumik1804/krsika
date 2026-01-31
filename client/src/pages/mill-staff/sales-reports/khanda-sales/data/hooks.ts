/**
 * Khanda Sales Hooks
 * React Query hooks for Khanda Sales data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchKhandaSalesList,
    fetchKhandaSaleById,
    fetchKhandaSalesSummary,
    createKhandaSale,
    updateKhandaSale,
    deleteKhandaSale,
    bulkDeleteKhandaSales,
} from './service'
import type {
    KhandaSaleResponse,
    KhandaSaleListResponse,
    KhandaSaleSummaryResponse,
    CreateKhandaSaleRequest,
    UpdateKhandaSaleRequest,
    KhandaSaleQueryParams,
    KhandaSaleSummaryQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const khandaSalesKeys = {
    all: ['khanda-sales'] as const,
    lists: () => [...khandaSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: KhandaSaleQueryParams) =>
        [...khandaSalesKeys.lists(), millId, params] as const,
    details: () => [...khandaSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...khandaSalesKeys.details(), millId, id] as const,
    summaries: () => [...khandaSalesKeys.all, 'summary'] as const,
    summary: (millId: string, params?: KhandaSaleSummaryQueryParams) =>
        [...khandaSalesKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch khanda sales list with pagination and filters
 */
export const useKhandaSalesList = (
    millId: string,
    params?: KhandaSaleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<KhandaSaleListResponse, Error>({
        queryKey: khandaSalesKeys.list(millId, params),
        queryFn: () => fetchKhandaSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single khanda sale
 */
export const useKhandaSaleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<KhandaSaleResponse, Error>({
        queryKey: khandaSalesKeys.detail(millId, id),
        queryFn: () => fetchKhandaSaleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch khanda sales summary/statistics
 */
export const useKhandaSalesSummary = (
    millId: string,
    params?: KhandaSaleSummaryQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<KhandaSaleSummaryResponse, Error>({
        queryKey: khandaSalesKeys.summary(millId, params),
        queryFn: () => fetchKhandaSalesSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new khanda sale
 */
export const useCreateKhandaSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<KhandaSaleResponse, Error, CreateKhandaSaleRequest>({
        mutationFn: (data) => createKhandaSale(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success('Khanda sale created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create khanda sale')
        },
    })
}

/**
 * Hook to update an existing khanda sale
 */
export const useUpdateKhandaSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<KhandaSaleResponse, Error, UpdateKhandaSaleRequest>({
        mutationFn: (data) => updateKhandaSale(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.detail(millId, data._id),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success('Khanda sale updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update khanda sale')
        },
    })
}

/**
 * Hook to delete a khanda sale
 */
export const useDeleteKhandaSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteKhandaSale(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success('Khanda sale deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete khanda sale')
        },
    })
}

/**
 * Hook to bulk delete khanda sales
 */
export const useBulkDeleteKhandaSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<{ deletedCount: number }, Error, string[]>({
        mutationFn: (ids) => bulkDeleteKhandaSales(millId, ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success(
                `${data.deletedCount} khanda sale(s) deleted successfully`
            )
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete khanda sales')
        },
    })
}
