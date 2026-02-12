import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPaddyPurchaseList,
    fetchPaddyPurchaseById,
    fetchPaddyPurchaseSummary,
    createPaddyPurchase,
    updatePaddyPurchase,
    deletePaddyPurchase,
    bulkDeletePaddyPurchase,
} from './service'
import type {
    CreatePaddyPurchaseRequest,
    UpdatePaddyPurchaseRequest,
    PaddyPurchaseQueryParams,
} from './types'

// Query Keys
export const paddyPurchaseKeys = {
    all: ['paddyPurchase'] as const,
    lists: () => [...paddyPurchaseKeys.all, 'list'] as const,
    list: (millId: string, params?: PaddyPurchaseQueryParams) =>
        [...paddyPurchaseKeys.lists(), millId, params] as const,
    details: () => [...paddyPurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...paddyPurchaseKeys.details(), millId, id] as const,
    summaries: () => [...paddyPurchaseKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...paddyPurchaseKeys.summaries(), millId] as const,
}

// Query Hooks
export const usePaddyPurchaseList = (
    millId: string,
    params?: PaddyPurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: paddyPurchaseKeys.list(millId, params || {}),
        queryFn: () => fetchPaddyPurchaseList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const usePaddyPurchaseById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: paddyPurchaseKeys.detail(millId, id),
        queryFn: () => fetchPaddyPurchaseById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

export const usePaddyPurchaseSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: paddyPurchaseKeys.summary(millId),
        queryFn: () => fetchPaddyPurchaseSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreatePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePaddyPurchaseRequest) =>
            createPaddyPurchase(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchase created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to create paddy purchase'
            )
        },
    })
}

export const useUpdatePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdatePaddyPurchaseRequest) =>
            updatePaddyPurchase(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.details(),
            })
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchase updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to update paddy purchase'
            )
        },
    })
}

export const useDeletePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deletePaddyPurchase(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchase deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to delete paddy purchase'
            )
        },
    })
}

export const useBulkDeletePaddyPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeletePaddyPurchase(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchases deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to delete paddy purchases'
            )
        },
    })
}
