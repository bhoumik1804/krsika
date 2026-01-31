/**
 * Nakkhi Sales Hooks
 * React Query hooks for Nakkhi Sales data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchNakkhiSalesList,
    fetchNakkhiSaleById,
    fetchNakkhiSalesSummary,
    createNakkhiSale,
    updateNakkhiSale,
    deleteNakkhiSale,
    bulkDeleteNakkhiSales,
} from './service'
import type {
    NakkhiSaleResponse,
    NakkhiSaleListResponse,
    NakkhiSaleSummaryResponse,
    CreateNakkhiSaleRequest,
    UpdateNakkhiSaleRequest,
    NakkhiSaleQueryParams,
    NakkhiSaleSummaryQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const nakkhiSalesKeys = {
    all: ['nakkhi-sales'] as const,
    lists: () => [...nakkhiSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: NakkhiSaleQueryParams) =>
        [...nakkhiSalesKeys.lists(), millId, params] as const,
    details: () => [...nakkhiSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...nakkhiSalesKeys.details(), millId, id] as const,
    summaries: () => [...nakkhiSalesKeys.all, 'summary'] as const,
    summary: (millId: string, params?: NakkhiSaleSummaryQueryParams) =>
        [...nakkhiSalesKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch nakkhi sales list with pagination and filters
 */
export const useNakkhiSalesList = (
    millId: string,
    params?: NakkhiSaleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<NakkhiSaleListResponse, Error>({
        queryKey: nakkhiSalesKeys.list(millId, params),
        queryFn: () => fetchNakkhiSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single nakkhi sale
 */
export const useNakkhiSaleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<NakkhiSaleResponse, Error>({
        queryKey: nakkhiSalesKeys.detail(millId, id),
        queryFn: () => fetchNakkhiSaleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch nakkhi sales summary/statistics
 */
export const useNakkhiSalesSummary = (
    millId: string,
    params?: NakkhiSaleSummaryQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<NakkhiSaleSummaryResponse, Error>({
        queryKey: nakkhiSalesKeys.summary(millId, params),
        queryFn: () => fetchNakkhiSalesSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new nakkhi sale
 */
export const useCreateNakkhiSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<NakkhiSaleResponse, Error, CreateNakkhiSaleRequest>({
        mutationFn: (data) => createNakkhiSale(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Nakkhi sale created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create nakkhi sale')
        },
    })
}

/**
 * Hook to update an existing nakkhi sale
 */
export const useUpdateNakkhiSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<NakkhiSaleResponse, Error, UpdateNakkhiSaleRequest>({
        mutationFn: (data) => updateNakkhiSale(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.detail(millId, data._id),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Nakkhi sale updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update nakkhi sale')
        },
    })
}

/**
 * Hook to delete a nakkhi sale
 */
export const useDeleteNakkhiSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteNakkhiSale(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Nakkhi sale deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete nakkhi sale')
        },
    })
}

/**
 * Hook to bulk delete nakkhi sales
 */
export const useBulkDeleteNakkhiSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<{ deletedCount: number }, Error, string[]>({
        mutationFn: (ids) => bulkDeleteNakkhiSales(millId, ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success(
                `${data.deletedCount} nakkhi sale(s) deleted successfully`
            )
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete nakkhi sales')
        },
    })
}
