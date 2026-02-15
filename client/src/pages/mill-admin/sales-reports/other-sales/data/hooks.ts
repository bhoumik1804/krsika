import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOtherSalesList,
    fetchOtherSalesById,
    createOtherSales,
    updateOtherSales,
    deleteOtherSales,
    bulkDeleteOtherSales,
} from './service'
import type {
    CreateOtherSalesRequest,
    UpdateOtherSalesRequest,
    OtherSalesQueryParams,
} from './types'

// Query Keys
export const otherSalesKeys = {
    all: ['otherSales'] as const,
    lists: () => [...otherSalesKeys.all, 'list'] as const,
    list: (millId: string, params?: OtherSalesQueryParams) =>
        [...otherSalesKeys.lists(), millId, params] as const,
    details: () => [...otherSalesKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...otherSalesKeys.details(), millId, id] as const,
}

// Query Hooks
export const useOtherSalesList = (
    millId: string,
    params?: OtherSalesQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: otherSalesKeys.list(millId, params || {}),
        queryFn: () => fetchOtherSalesList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useOtherSalesById = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: otherSalesKeys.detail(millId, id),
        queryFn: () => fetchOtherSalesById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000,
    })
}

// Mutation Hooks
export const useCreateOtherSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOtherSalesRequest) =>
            createOtherSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherSalesKeys.lists(),
            })
            toast.success('Other sale created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to create other sale'
            )
        },
    })
}

export const useUpdateOtherSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateOtherSalesRequest) =>
            updateOtherSales(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherSalesKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherSalesKeys.details(),
            })
            toast.success('Other sale updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to update other sale'
            )
        },
    })
}

export const useDeleteOtherSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteOtherSales(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherSalesKeys.lists(),
            })
            toast.success('Other sale deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete other sale'
            )
        },
    })
}

export const useBulkDeleteOtherSales = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteOtherSales(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherSalesKeys.lists(),
            })
            toast.success('Other sales deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Failed to delete other sales'
            )
        },
    })
}
