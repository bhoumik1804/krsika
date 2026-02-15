import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import {
    createPaddySale,
    deleteBulkPaddySales,
    deletePaddySale,
    getPaddySales,
    getPaddySaleSummary,
    updatePaddySale,
} from './service'
import type { PaddySales } from './types'

export const usePaddySalesList = (
    queryParams: {
        page: number
        limit: number
        search?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    },
    options: { enabled: boolean }
) => {
    const { millId } = useParams()
    return useQuery({
        queryKey: ['paddy-sales', millId, queryParams],
        queryFn: () =>
            getPaddySales(
                millId as string,
                {
                    pageIndex: queryParams.page - 1,
                    pageSize: queryParams.limit,
                },
                [
                    {
                        id: queryParams.sortBy || 'date',
                        desc: queryParams.sortOrder === 'desc',
                    },
                ],
                queryParams.search || '',
                {}
            ),
        enabled: options.enabled,
    })
}

export const usePaddySalesSummary = (filters: Record<string, unknown>) => {
    const { millId } = useParams()
    return useQuery({
        queryKey: ['paddy-sales-summary', millId, filters],
        queryFn: () => getPaddySaleSummary(millId as string, filters),
        enabled: !!millId,
    })
}

export const useCreatePaddySale = () => {
    const { millId } = useParams()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: PaddySales) =>
            createPaddySale(millId as string, data),
        onSuccess: () => {
            toast.success('Paddy sale created successfully')
            queryClient.invalidateQueries({ queryKey: ['paddy-sales'] })
            queryClient.invalidateQueries({
                queryKey: ['paddy-sales-summary'],
            })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })
}

export const useUpdatePaddySale = () => {
    const { millId } = useParams()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: PaddySales }) =>
            updatePaddySale(millId as string, id, data),
        onSuccess: () => {
            toast.success('Paddy sale updated successfully')
            queryClient.invalidateQueries({ queryKey: ['paddy-sales'] })
            queryClient.invalidateQueries({
                queryKey: ['paddy-sales-summary'],
            })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })
}

export const useDeletePaddySale = () => {
    const { millId } = useParams()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deletePaddySale(millId as string, id),
        onSuccess: () => {
            toast.success('Paddy sale deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['paddy-sales'] })
            queryClient.invalidateQueries({
                queryKey: ['paddy-sales-summary'],
            })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })
}

export const useDeleteBulkPaddySales = () => {
    const { millId } = useParams()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            deleteBulkPaddySales(millId as string, ids),
        onSuccess: () => {
            toast.success('Paddy sales deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['paddy-sales'] })
            queryClient.invalidateQueries({
                queryKey: ['paddy-sales-summary'],
            })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })
}
