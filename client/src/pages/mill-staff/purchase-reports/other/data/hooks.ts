import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { OtherPurchase } from './schema'
import { otherPurchaseService } from './service'

// Query key factory for other purchases
const otherPurchaseQueryKeys = {
    all: ['other-purchases'] as const,
    byMill: (millId: string) =>
        [...otherPurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...otherPurchaseQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseOtherPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useOtherPurchaseList = (params: UseOtherPurchaseListParams) => {
    const query = useQuery({
        queryKey: otherPurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => otherPurchaseService.fetchOtherPurchaseList(params),
        enabled: !!params.millId,
    })

    return {
        data: query.data?.data || [],
        pagination: (query.data?.pagination as any) || {
            page: params.page || 1,
            pageSize: params.pageSize || 10,
            total: 0,
            totalPages: 0,
        },
        isLoading: query.isLoading,
        isError: query.isError,
    }
}

export const useCreateOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<OtherPurchase, 'id'>) =>
            otherPurchaseService.createOtherPurchase(millId, data),
        onSuccess: () => {
            toast.success('Other purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: otherPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create other purchase'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: {
            purchaseId: string
            data: Omit<OtherPurchase, 'id'>
        }) =>
            otherPurchaseService.updateOtherPurchase(
                millId,
                params.purchaseId,
                params.data
            ),
        onSuccess: () => {
            toast.success('Other purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: otherPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update other purchase'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteOtherPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            otherPurchaseService.deleteOtherPurchase(millId, purchaseId),
        onSuccess: () => {
            toast.success('Other purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: otherPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete other purchase'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteOtherPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            otherPurchaseService.bulkDeleteOtherPurchases(millId, purchaseIds),
        onSuccess: () => {
            toast.success('Other purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: otherPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete other purchases'
            toast.error(errorMessage)
        },
    })
}
