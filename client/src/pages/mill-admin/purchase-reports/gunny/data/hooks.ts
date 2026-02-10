/**
 * Gunny Purchase Hooks
 * React Query hooks for Gunny Purchase data management (Mill Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { GunnyPurchaseData } from './schema'
import {
    fetchGunnyPurchaseList,
    fetchGunnyPurchaseById,
    createGunnyPurchase,
    updateGunnyPurchase,
    deleteGunnyPurchase,
    bulkDeleteGunnyPurchases,
} from './service'
import type {
    GunnyPurchaseResponse,
    GunnyPurchaseListResponse,
    CreateGunnyPurchaseRequest,
    UpdateGunnyPurchaseRequest,
    GunnyPurchaseQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const gunnyPurchaseKeys = {
    all: ['gunny-purchases'] as const,
    byMill: (millId: string) => [...gunnyPurchaseKeys.all, millId] as const,
    list: (millId: string, params?: GunnyPurchaseQueryParams) =>
        [...gunnyPurchaseKeys.byMill(millId), 'list', params] as const,
    details: () => [...gunnyPurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...gunnyPurchaseKeys.details(), millId, id] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch gunny purchases list with pagination and filters
 */
export const useGunnyPurchaseList = (
    millId: string,
    params?: GunnyPurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyPurchaseListResponse, Error>({
        queryKey: gunnyPurchaseKeys.list(millId, params),
        queryFn: () => fetchGunnyPurchaseList(millId, params),
        enabled: (options?.enabled ?? true) && !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single gunny purchase
 */
export const useGunnyPurchaseDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyPurchaseResponse, Error>({
        queryKey: gunnyPurchaseKeys.detail(millId, id),
        queryFn: () => fetchGunnyPurchaseById(millId, id),
        enabled: (options?.enabled ?? true) && !!millId && !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new gunny purchase
 */
export const useCreateGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGunnyPurchaseRequest) =>
            createGunnyPurchase(millId, data),
        onSuccess: () => {
            toast.success('Gunny purchase created successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.byMill(millId),
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

/**
 * Hook to update a gunny purchase
 */
export const useUpdateGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: UpdateGunnyPurchaseRequest) =>
            updateGunnyPurchase(millId, params),
        onSuccess: () => {
            toast.success('Gunny purchase updated successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.byMill(millId),
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

/**
 * Hook to delete a gunny purchase
 */
export const useDeleteGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteGunnyPurchase(millId, id),
        onSuccess: () => {
            toast.success('Gunny purchase deleted successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.byMill(millId),
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

/**
 * Hook to bulk delete gunny purchases
 */
export const useBulkDeleteGunnyPurchases = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteGunnyPurchases(millId, ids),
        onSuccess: () => {
            toast.success('Gunny purchases deleted successfully')
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.byMill(millId),
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
