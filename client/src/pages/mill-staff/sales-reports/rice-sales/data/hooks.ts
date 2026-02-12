import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchRiceSalesList,
    fetchRiceSalesById,
    fetchRiceSalesSummary,
    createRiceSales,
    updateRiceSales,
    deleteRiceSales,
    bulkDeleteRiceSales,
} from './service'
import type {
    CreateRiceSalesRequest,
    UpdateRiceSalesRequest,
    RiceSalesQueryParams,
} from './types'

// Query Keys
export const riceSalesKeys = {
    all: ['riceSales'] as const,
    lists: () => [...riceSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: RiceSalesQueryParams) =>
        [...riceSalesKeys.lists(), millId, params] as const,
    details: () => [...riceSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...riceSalesKeys.details(), millId, id] as const,
    summaries: () => [...riceSalesKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...riceSalesKeys.summaries(), millId] as const,
}

// Query Hooks
export const useRiceSalesList = (
    millId: string,
    params?: RiceSalesQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: riceSalesKeys.list(millId, params || {}),
        queryFn: () => fetchRiceSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useRiceSalesById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: riceSalesKeys.detail(millId, id),
        queryFn: () => fetchRiceSalesById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

export const useRiceSalesSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: riceSalesKeys.summary(millId),
        queryFn: () => fetchRiceSalesSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreateRiceSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRiceSalesRequest) =>
            createRiceSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sale created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to create rice sale'
            )
        },
    })
}

export const useUpdateRiceSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateRiceSalesRequest) =>
            updateRiceSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.details(),
            })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sale updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to update rice sale'
            )
        },
    })
}

export const useDeleteRiceSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteRiceSales(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sale deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete rice sale'
            )
        },
    })
}

export const useBulkDeleteRiceSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteRiceSales(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceSalesKeys.summaries(),
            })
            toast.success('Rice sales deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete rice sales'
            )
        },
    })
}
