import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PaddyPurchaseData } from './schema'
import { paddyPurchaseService } from './service'

// Query key factory for paddy purchases
const paddyPurchaseQueryKeys = {
    all: ['paddy-purchases'] as const,
    byMill: (millId: string) =>
        [...paddyPurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...paddyPurchaseQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UsePaddyPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const usePaddyPurchaseList = (params: UsePaddyPurchaseListParams) => {
    return useQuery({
        queryKey: paddyPurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => paddyPurchaseService.fetchPaddyPurchaseList(params),
        enabled: !!params.millId,
    })
}

export const useCreatePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<PaddyPurchaseData, 'id'>) =>
            paddyPurchaseService.createPaddyPurchase(millId, data),
        onSuccess: () => {
            toast.success('Paddy purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create paddy purchase'
            toast.error(errorMessage)
        },
    })
}

export const useUpdatePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            purchaseId,
            data,
        }: {
            purchaseId: string
            data: Omit<PaddyPurchaseData, 'id'>
        }) => paddyPurchaseService.updatePaddyPurchase(millId, purchaseId, data),
        onSuccess: () => {
            toast.success('Paddy purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update paddy purchase'
            toast.error(errorMessage)
        },
    })
}

export const useDeletePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            paddyPurchaseService.deletePaddyPurchase(millId, purchaseId),
        onSuccess: () => {
            toast.success('Paddy purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete paddy purchase'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeletePaddyPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            paddyPurchaseService.bulkDeletePaddyPurchases(millId, purchaseIds),
        onSuccess: () => {
            toast.success('Paddy purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete paddy purchases'
            toast.error(errorMessage)
        },
    })
}
