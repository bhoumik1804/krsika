import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BalanceLiftingPurchasesFrk } from './schema'
import { balanceLiftingFrkPurchaseService } from './service'
import type { BalanceLiftingFrkPurchaseListResponse } from './types'

// Query key factory for Balance Lifting FRK purchases
const balanceLiftingFrkPurchaseQueryKeys = {
    all: ['balance-lifting-frk-purchases'] as const,
    byMill: (millId: string) =>
        [...balanceLiftingFrkPurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [
            ...balanceLiftingFrkPurchaseQueryKeys.byMill(millId),
            'list',
            filters,
        ] as const,
}

interface UseBalanceLiftingFrkPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useBalanceLiftingFrkPurchaseList = (
    params: UseBalanceLiftingFrkPurchaseListParams
) => {
    return useQuery<BalanceLiftingFrkPurchaseListResponse, Error>({
        queryKey: balanceLiftingFrkPurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => balanceLiftingFrkPurchaseService.fetchList(params),
        enabled: !!params.millId,
    })
}

export const useCreateBalanceLiftingFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<BalanceLiftingPurchasesFrk, '_id'>) =>
            balanceLiftingFrkPurchaseService.create(millId, data),
        onSuccess: () => {
            toast.success('FRK purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingFrkPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create FRK purchase'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateBalanceLiftingFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            purchaseId,
            data,
        }: {
            purchaseId: string
            data: Omit<BalanceLiftingPurchasesFrk, '_id'>
        }) => balanceLiftingFrkPurchaseService.update(millId, purchaseId, data),
        onSuccess: () => {
            toast.success('FRK purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingFrkPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update FRK purchase'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteBalanceLiftingFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            balanceLiftingFrkPurchaseService.delete(millId, purchaseId),
        onSuccess: () => {
            toast.success('FRK purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingFrkPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete FRK purchase'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteBalanceLiftingFrkPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            balanceLiftingFrkPurchaseService.bulkDelete(millId, purchaseIds),
        onSuccess: () => {
            toast.success('FRK purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: balanceLiftingFrkPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete FRK purchases'
            toast.error(errorMessage)
        },
    })
}
