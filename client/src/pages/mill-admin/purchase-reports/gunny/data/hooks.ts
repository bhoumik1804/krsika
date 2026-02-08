import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { GunnyPurchaseData } from './schema'
import { gunnyPurchaseService } from './service'

// Query key factory for gunny purchases
const gunnyPurchaseQueryKeys = {
    all: ['gunny-purchases'] as const,
    byMill: (millId: string) =>
        [...gunnyPurchaseQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...gunnyPurchaseQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseGunnyPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const useGunnyPurchaseList = (params: UseGunnyPurchaseListParams) => {
    const query = useQuery({
        queryKey: gunnyPurchaseQueryKeys.list(params.millId, {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }),
        queryFn: () => gunnyPurchaseService.fetchGunnyPurchaseList(params),
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

export const useCreateGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<GunnyPurchaseData, 'id'>) =>
            gunnyPurchaseService.createGunnyPurchase(millId, data),
        onSuccess: () => {
            toast.success('Gunny purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create gunny purchase'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: {
            purchaseId: string
            data: Omit<GunnyPurchaseData, 'id'>
        }) =>
            gunnyPurchaseService.updateGunnyPurchase(
                millId,
                params.purchaseId,
                params.data
            ),
        onSuccess: () => {
            toast.success('Gunny purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update gunny purchase'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseId: string) =>
            gunnyPurchaseService.deleteGunnyPurchase(millId, purchaseId),
        onSuccess: () => {
            toast.success('Gunny purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete gunny purchase'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteGunnyPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (purchaseIds: string[]) =>
            gunnyPurchaseService.bulkDeleteGunnyPurchases(millId, purchaseIds),
        onSuccess: () => {
            toast.success('Gunny purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete gunny purchases'
            toast.error(errorMessage)
        },
    })
}
