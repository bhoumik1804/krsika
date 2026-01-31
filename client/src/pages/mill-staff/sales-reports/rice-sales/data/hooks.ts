/**
 * Rice Sales Hooks
 * React Query hooks for Rice Sales data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchRiceSalesList,
    fetchRiceSaleById,
    fetchRiceSalesSummary,
    createRiceSale,
    updateRiceSale,
    deleteRiceSale,
    bulkDeleteRiceSales,
} from './service'
import type {
    RiceSaleResponse,
    RiceSaleListResponse,
    RiceSaleSummaryResponse,
    CreateRiceSaleRequest,
    UpdateRiceSaleRequest,
    RiceSaleQueryParams,
    RiceSaleSummaryQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const riceSalesKeys = {
    all: ['rice-sales'] as const,
    lists: () => [...riceSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: RiceSaleQueryParams) =>
        [...riceSalesKeys.lists(), millId, params] as const,
    details: () => [...riceSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...riceSalesKeys.details(), millId, id] as const,
    summaries: () => [...riceSalesKeys.all, 'summary'] as const,
    summary: (millId: string, params?: RiceSaleSummaryQueryParams) =>
        [...riceSalesKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch rice sales list with pagination and filters
 */
export const useRiceSalesList = (
    millId: string,
    params?: RiceSaleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<RiceSaleListResponse, Error>({
        queryKey: riceSalesKeys.list(millId, params),
        queryFn: () => fetchRiceSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single rice sale
 */
export const useRiceSaleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<RiceSaleResponse, Error>({
        queryKey: riceSalesKeys.detail(millId, id),
        queryFn: () => fetchRiceSaleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch rice sales summary/statistics
 */
export const useRiceSalesSummary = (
    millId: string,
    params?: RiceSaleSummaryQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<RiceSaleSummaryResponse, Error>({
        queryKey: riceSalesKeys.summary(millId, params),
        queryFn: () => fetchRiceSalesSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new rice sale
 */
export const useCreateRiceSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<RiceSaleResponse, Error, CreateRiceSaleRequest>({
        mutationFn: (data) => createRiceSale(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riceSalesKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sale created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create rice sale')
        },
    })
}

/**
 * Hook to update an existing rice sale
 */
export const useUpdateRiceSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<RiceSaleResponse, Error, UpdateRiceSaleRequest>({
        mutationFn: (data) => updateRiceSale(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: riceSalesKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.detail(millId, data._id),
            })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sale updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update rice sale')
        },
    })
}

/**
 * Hook to delete a rice sale
 */
export const useDeleteRiceSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteRiceSale(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: riceSalesKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sale deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete rice sale')
        },
    })
}

/**
 * Hook to bulk delete rice sales
 */
export const useBulkDeleteRiceSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<{ deletedCount: number }, Error, string[]>({
        mutationFn: (ids) => bulkDeleteRiceSales(millId, ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: riceSalesKeys.lists() })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success(
                `${data.deletedCount} rice sale(s) deleted successfully`
            )
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete rice sales')
        },
    })
}
