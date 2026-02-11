import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchNakkhiSalesList,
    fetchNakkhiSalesById,
    fetchNakkhiSalesSummary,
    createNakkhiSales,
    updateNakkhiSales,
    deleteNakkhiSales,
    bulkDeleteNakkhiSales,
} from './service'
import type {
    CreateNakkhiSalesRequest,
    UpdateNakkhiSalesRequest,
    NakkhiSalesQueryParams,
} from './types'

// Query Keys
export const nakkhiSalesKeys = {
    all: ['nakkhiSales'] as const,
    lists: () => [...nakkhiSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: NakkhiSalesQueryParams) =>
        [...nakkhiSalesKeys.lists(), millId, params] as const,
    details: () => [...nakkhiSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...nakkhiSalesKeys.details(), millId, id] as const,
    summaries: () => [...nakkhiSalesKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...nakkhiSalesKeys.summaries(), millId] as const,
}

// Query Hooks
export const useNakkhiSalesList = (
    millId: string,
    params?: NakkhiSalesQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: nakkhiSalesKeys.list(millId, params || {}),
        queryFn: () => fetchNakkhiSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useNakkhiSalesById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: nakkhiSalesKeys.detail(millId, id),
        queryFn: () => fetchNakkhiSalesById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

export const useNakkhiSalesSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: nakkhiSalesKeys.summary(millId),
        queryFn: () => fetchNakkhiSalesSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreateNakkhiSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateNakkhiSalesRequest) =>
            createNakkhiSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Nakkhi sale created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to create nakkhi sale'
            )
        },
    })
}

export const useUpdateNakkhiSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateNakkhiSalesRequest) =>
            updateNakkhiSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.details(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Nakkhi sale updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to update nakkhi sale'
            )
        },
    })
}

export const useDeleteNakkhiSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteNakkhiSales(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Nakkhi sale deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete nakkhi sale'
            )
        },
    })
}

export const useBulkDeleteNakkhiSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteNakkhiSales(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiSalesKeys.summaries(),
            })
            toast.success('Records deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete records'
            )
        },
    })
}
