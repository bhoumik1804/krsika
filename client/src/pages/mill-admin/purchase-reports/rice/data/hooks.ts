import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { RicePurchaseData } from './schema'
import { ricePurchaseService } from './service'

// Query key factory for rice purchases
const ricePurchaseQueryKeys = {
    all: ['rice-purchases'] as const,
    byMill: (millId: string) =>
        [...ricePurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...ricePurchaseQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseRicePurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useRicePurchaseList = (params: UseRicePurchaseListParams) => {
    return useQuery({
        queryKey: ricePurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => ricePurchaseService.fetchRicePurchaseList(params),
        enabled: !!params.millId,
    })
}

export const useCreateRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<RicePurchaseData, 'id'>) =>
            ricePurchaseService.createRicePurchase(millId, data),
        onSuccess: () => {
            toast.success('Rice purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: ricePurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create rice purchase'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            purchaseId,
            data,
        }: {
            purchaseId: string
            data: Omit<RicePurchaseData, 'id'>
        }) => ricePurchaseService.updateRicePurchase(millId, purchaseId, data),
        onSuccess: () => {
            toast.success('Rice purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: ricePurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update rice purchase'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            ricePurchaseService.deleteRicePurchase(millId, purchaseId),
        onSuccess: () => {
            toast.success('Rice purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: ricePurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete rice purchase'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteRicePurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            ricePurchaseService.bulkDeleteRicePurchases(millId, purchaseIds),
        onSuccess: () => {
            toast.success('Rice purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: ricePurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete rice purchases'
            toast.error(errorMessage)
        },
    })
}
