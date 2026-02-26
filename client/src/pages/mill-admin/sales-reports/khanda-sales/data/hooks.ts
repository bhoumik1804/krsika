import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchKhandaSalesList,
    fetchKhandaSalesById,
    fetchKhandaSalesSummary,
    createKhandaSales,
    updateKhandaSales,
    deleteKhandaSales,
    bulkDeleteKhandaSales,
} from './service'
import type {
    CreateKhandaSalesRequest,
    UpdateKhandaSalesRequest,
    KhandaSalesQueryParams,
} from './types'

// Query Keys
export const khandaSalesKeys = {
    all: ['khandaSales'] as const,
    lists: () => [...khandaSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: KhandaSalesQueryParams) =>
        [...khandaSalesKeys.lists(), millId, params] as const,
    details: () => [...khandaSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...khandaSalesKeys.details(), millId, id] as const,
    summaries: () => [...khandaSalesKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...khandaSalesKeys.summaries(), millId] as const,
}

// Query Hooks
export const useKhandaSalesList = (
    millId: string,
    params?: KhandaSalesQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: khandaSalesKeys.list(millId, params || {}),
        queryFn: () => fetchKhandaSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useKhandaSalesById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: khandaSalesKeys.detail(millId, id),
        queryFn: () => fetchKhandaSalesById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

export const useKhandaSalesSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: khandaSalesKeys.summary(millId),
        queryFn: () => fetchKhandaSalesSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreateKhandaSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateKhandaSalesRequest) =>
            createKhandaSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success('Khanda sale created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to create khanda sale'
            )
        },
    })
}

export const useUpdateKhandaSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateKhandaSalesRequest) =>
            updateKhandaSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.details(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success('Khanda sale updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to update khanda sale'
            )
        },
    })
}

export const useDeleteKhandaSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteKhandaSales(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
            })
            toast.success('Khanda sale deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete khanda sale'
            )
        },
    })
}

export const useBulkDeleteKhandaSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteKhandaSales(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: khandaSalesKeys.summaries(),
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
