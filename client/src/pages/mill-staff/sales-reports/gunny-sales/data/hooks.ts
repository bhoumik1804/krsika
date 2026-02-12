import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGunnySalesList,
    fetchGunnySalesById,
    fetchGunnySalesSummary,
    createGunnySales,
    updateGunnySales,
    deleteGunnySales,
    bulkDeleteGunnySales,
} from './service'
import type {
    CreateGunnySalesRequest,
    UpdateGunnySalesRequest,
    GunnySalesQueryParams,
} from './types'

// Query Keys
export const gunnySalesKeys = {
    all: ['gunnySales'] as const,
    lists: () => [...gunnySalesKeys.all, 'list'] as const,
    list: (millId: string, params?: GunnySalesQueryParams) =>
        [...gunnySalesKeys.lists(), millId, params] as const,
    details: () => [...gunnySalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...gunnySalesKeys.details(), millId, id] as const,
    summaries: () => [...gunnySalesKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...gunnySalesKeys.summaries(), millId] as const,
}

// Query Hooks
export const useGunnySalesList = (
    millId: string,
    params?: GunnySalesQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: gunnySalesKeys.list(millId, params || {}),
        queryFn: () => fetchGunnySalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useGunnySalesById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: gunnySalesKeys.detail(millId, id),
        queryFn: () => fetchGunnySalesById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

export const useGunnySalesSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: gunnySalesKeys.summary(millId),
        queryFn: () => fetchGunnySalesSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreateGunnySales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGunnySalesRequest) =>
            createGunnySales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.summaries(),
            })
            toast.success('Gunny sale created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to create gunny sale'
            )
        },
    })
}

export const useUpdateGunnySales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateGunnySalesRequest) =>
            updateGunnySales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.details(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.summaries(),
            })
            toast.success('Gunny sale updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to update gunny sale'
            )
        },
    })
}

export const useDeleteGunnySales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteGunnySales(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.summaries(),
            })
            toast.success('Gunny sale deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete gunny sale'
            )
        },
    })
}

export const useBulkDeleteGunnySales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteGunnySales(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySalesKeys.summaries(),
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
