import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { FrkPurchaseData } from './schema'
import { frkPurchaseService } from './service'

// Query key factory for FRK purchases
const frkPurchaseQueryKeys = {
    all: ['frk-purchases'] as const,
    byMill: (millId: string) =>
        [...frkPurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...frkPurchaseQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseFrkPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useFrkPurchaseList = (params: UseFrkPurchaseListParams) => {
    const query = useQuery({
        queryKey: frkPurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => frkPurchaseService.fetchFrkPurchaseList(params),
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

export const useCreateFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<FrkPurchaseData, '_id'>) =>
            frkPurchaseService.createFrkPurchase(millId, data),
        onSuccess: () => {
            toast.success('FRK purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: frkPurchaseQueryKeys.byMill(millId),
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

export const useUpdateFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            purchaseId,
            data,
        }: {
            purchaseId: string
            data: Omit<FrkPurchaseData, '_id'>
        }) => frkPurchaseService.updateFrkPurchase(millId, purchaseId, data),
        onSuccess: () => {
            toast.success('FRK purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: frkPurchaseQueryKeys.byMill(millId),
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

export const useDeleteFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            frkPurchaseService.deleteFrkPurchase(millId, purchaseId),
        onSuccess: () => {
            toast.success('FRK purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: frkPurchaseQueryKeys.byMill(millId),
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

export const useBulkDeleteFrkPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            frkPurchaseService.bulkDeleteFrkPurchases(millId, purchaseIds),
        onSuccess: () => {
            toast.success('FRK purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: frkPurchaseQueryKeys.byMill(millId),
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
