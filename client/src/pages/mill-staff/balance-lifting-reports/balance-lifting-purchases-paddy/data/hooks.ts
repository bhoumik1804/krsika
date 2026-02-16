import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BalanceLiftingPurchasesPaddy } from './schema'
import { balanceLiftingPaddyPurchaseService } from './service'
import type { BalanceLiftingPaddyPurchaseListResponse } from './types'

// Query key factory for Balance Lifting Paddy purchases
const balanceLiftingPaddyPurchaseQueryKeys = {
    all: ['balance-lifting-paddy-purchases'] as const,
    byMill: (millId: string) =>
        [...balanceLiftingPaddyPurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [
            ...balanceLiftingPaddyPurchaseQueryKeys.byMill(millId),
            'list',
            filters,
        ] as const,
}

interface UseBalanceLiftingPaddyPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useBalanceLiftingPaddyPurchaseList = (
    params: UseBalanceLiftingPaddyPurchaseListParams
) => {
    return useQuery<BalanceLiftingPaddyPurchaseListResponse, Error>({
        queryKey: balanceLiftingPaddyPurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => balanceLiftingPaddyPurchaseService.fetchList(params),
        enabled: !!params.millId,
    })
}

export const useCreateBalanceLiftingPaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<BalanceLiftingPurchasesPaddy, '_id'>) =>
            balanceLiftingPaddyPurchaseService.create(millId, data),
        onSuccess: () => {
            toast.success('Paddy purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPaddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create Paddy purchase'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateBalanceLiftingPaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            purchaseId,
            data,
        }: {
            purchaseId: string
            data: Omit<BalanceLiftingPurchasesPaddy, '_id'>
        }) =>
            balanceLiftingPaddyPurchaseService.update(millId, purchaseId, data),
        onSuccess: () => {
            toast.success('Paddy purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPaddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update Paddy purchase'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteBalanceLiftingPaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            balanceLiftingPaddyPurchaseService.delete(millId, purchaseId),
        onSuccess: () => {
            toast.success('Paddy purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPaddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete Paddy purchase'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteBalanceLiftingPaddyPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            balanceLiftingPaddyPurchaseService.bulkDelete(millId, purchaseIds),
        onSuccess: () => {
            toast.success('Paddy purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPaddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete Paddy purchases'
            toast.error(errorMessage)
        },
    })
}
